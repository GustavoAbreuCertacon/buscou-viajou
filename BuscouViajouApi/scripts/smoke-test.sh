#!/bin/bash
# Smoke test do backend Buscou Viajou
set +e

API="http://localhost:3001/v1"
SB_URL="https://cscblvcqjwxmgzalowop.supabase.co"
ANON="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzY2JsdmNxand4bWd6YWxvd29wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY2MjczNzAsImV4cCI6MjA5MjIwMzM3MH0.-HfAFNjSA_UU4f2SB1v1_JTB9TW2N9BxVcLURPOPgOE"

PASS=0; FAIL=0
LAST="$(dirname "$0")/_last-response.json"

check() {
  local name="$1"; local expected="$2"; local got="$3"
  if [ "$got" = "$expected" ]; then
    echo "  OK   $name (HTTP $got)"
    PASS=$((PASS+1))
  else
    echo "  FAIL $name expected=$expected got=$got"
    FAIL=$((FAIL+1))
  fi
}

http_status() {
  curl -s -o "$LAST" -w "%{http_code}" "$@"
}

echo "============================================================"
echo "  SMOKE TEST - Buscou Viajou API"
echo "============================================================"

echo ""
echo "[publico] Health & Cities"
check "GET /health"                    "200" "$(http_status $API/health)"
check "GET /cities/search?q=campos"    "200" "$(http_status "$API/cities/search?q=campos")"

echo ""
echo "[publico] Companies"
check "GET /companies"                 "200" "$(http_status $API/companies)"
COMPANY_ID=$(python -c "import json; d=json.load(open(r'$LAST')); print(d['data'][0]['id'])")
echo "       primeira empresa: $COMPANY_ID"
check "GET /companies/:id"             "200" "$(http_status $API/companies/$COMPANY_ID)"
check "GET /companies/:id/reviews"     "200" "$(http_status $API/companies/$COMPANY_ID/reviews)"
check "GET /companies/:id/vehicles"    "200" "$(http_status $API/companies/$COMPANY_ID/vehicles)"
VEHICLE_ID=$(python -c "import json; d=json.load(open(r'$LAST')); print(d['data'][0]['id'])")
echo "       primeiro veiculo: $VEHICLE_ID"

echo ""
echo "[publico] Vehicles"
check "GET /vehicles/:id"              "200" "$(http_status $API/vehicles/$VEHICLE_ID)"
check "GET /vehicles/:id/reviews"      "200" "$(http_status $API/vehicles/$VEHICLE_ID/reviews)"

echo ""
echo "[publico] Quotes"
QUOTE_BODY='{"origin":"Sao Paulo","destination":"Campos do Jordao","departureDate":"2026-05-15T08:00:00.000-03:00","passengers":10}'
check "POST /quotes (busca valida)"    "201" "$(http_status -X POST $API/quotes -H 'Content-Type: application/json' -d "$QUOTE_BODY")"
LOCKED_QUOTE_ID=$(python -c "import json; d=json.load(open(r'$LAST')); print(d['data'][0]['lockedQuoteId'])")
N=$(python -c "import json; d=json.load(open(r'$LAST')); print(len(d['data']))")
DIST=$(python -c "import json; d=json.load(open(r'$LAST')); print(d['meta']['distanceKm'])")
echo "       $N veiculos retornados, distancia $DIST km, lockedQuoteId=$LOCKED_QUOTE_ID"

check "POST /quotes (body vazio)"      "400" "$(http_status -X POST $API/quotes -H 'Content-Type: application/json' -d '{}')"
check "POST /quotes (cidade invalida)" "400" "$(http_status -X POST $API/quotes -H 'Content-Type: application/json' -d '{"origin":"Marte","destination":"Lua","departureDate":"2026-05-15T08:00:00.000-03:00","passengers":10}')"

echo ""
echo "[auth] Login no Supabase Auth como cliente1@..."
TOKEN=$(curl -s -X POST "$SB_URL/auth/v1/token?grant_type=password" \
  -H "apikey: $ANON" -H "Content-Type: application/json" \
  -d '{"email":"cliente1@buscouviajou.demo","password":"demo12345"}' \
  | python -c "import json,sys; d=json.load(sys.stdin); print(d.get('access_token',''))")
if [ -n "$TOKEN" ]; then
  echo "  OK   access_token obtido (${#TOKEN} chars)"
  PASS=$((PASS+1))
else
  echo "  FAIL nao conseguiu logar"
  FAIL=$((FAIL+1))
fi

echo ""
echo "[auth] Endpoints autenticados"
check "GET /auth/me (com JWT)"         "200" "$(http_status $API/auth/me -H "Authorization: Bearer $TOKEN")"
ME=$(python -c "import json; d=json.load(open(r'$LAST')); print(f\"{d['first_name']} {d['last_name']} ({d['role']})\")")
echo "       perfil: $ME"

check "GET /auth/me (sem JWT)"         "401" "$(http_status $API/auth/me)"
check "GET /bookings"                  "200" "$(http_status $API/bookings -H "Authorization: Bearer $TOKEN")"
N_BOOK=$(python -c "import json; d=json.load(open(r'$LAST')); print(len(d['data']))")
echo "       cliente1 ja tem $N_BOOK reservas no historico"

echo ""
echo "[auth] Fluxo completo de reserva"
BOOK_BODY="{\"lockedQuoteId\":\"$LOCKED_QUOTE_ID\",\"passengers\":10,\"isRoundTrip\":false}"
check "POST /bookings"                 "201" "$(http_status -X POST $API/bookings -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "$BOOK_BODY")"
BOOKING_ID=$(python -c "import json; d=json.load(open(r'$LAST')); print(d.get('id',''))")
BOOK_CODE=$(python -c "import json; d=json.load(open(r'$LAST')); print(d.get('booking_code',''))")
BOOK_STATUS=$(python -c "import json; d=json.load(open(r'$LAST')); print(d.get('status',''))")
echo "       $BOOK_CODE / status=$BOOK_STATUS / id=$BOOKING_ID"

check "GET /bookings/:id"              "200" "$(http_status $API/bookings/$BOOKING_ID -H "Authorization: Bearer $TOKEN")"
check "POST /bookings/:id/_demo/approve-and-pay" "201" "$(http_status -X POST $API/bookings/$BOOKING_ID/_demo/approve-and-pay -H "Authorization: Bearer $TOKEN")"
check "GET /bookings/:id/ticket"       "200" "$(http_status $API/bookings/$BOOKING_ID/ticket -H "Authorization: Bearer $TOKEN")"
TICKET_CODE=$(python -c "import json; d=json.load(open(r'$LAST')); print(d.get('ticket_code',''))")
QR_OK=$(python -c "import json; d=json.load(open(r'$LAST')); print('YES' if d.get('qr_svg','').startswith('<svg') else 'NO')")
QR_PNG_OK=$(python -c "import json; d=json.load(open(r'$LAST')); print('YES' if d.get('qr_png_base64','').startswith('data:image/png') else 'NO')")
echo "       ticket=$TICKET_CODE / qr_svg=$QR_OK / qr_png_base64=$QR_PNG_OK"

check "POST /bookings/:id/cancel"      "201" "$(http_status -X POST $API/bookings/$BOOKING_ID/cancel -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{"reason":"teste de cancelamento"}')"
REFUND=$(python -c "import json; d=json.load(open(r'$LAST')); print(d.get('refund_percentage','?'))")
echo "       reembolso aplicado: $REFUND %"

echo ""
echo "============================================================"
echo "  RESULTADO: $PASS passou, $FAIL falhou"
echo "============================================================"
exit $FAIL
