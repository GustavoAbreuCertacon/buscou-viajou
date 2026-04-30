export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      addons: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price: number
          pricing_type: Database["public"]["Enums"]["addon_pricing_type"]
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price: number
          pricing_type: Database["public"]["Enums"]["addon_pricing_type"]
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
          pricing_type?: Database["public"]["Enums"]["addon_pricing_type"]
        }
        Relationships: [
          {
            foreignKeyName: "addons_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      amenities: {
        Row: {
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      audit_log: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: unknown
          new_values: Json | null
          old_values: Json | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: unknown
          new_values?: Json | null
          old_values?: Json | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_addons: {
        Row: {
          addon_id: string
          booking_id: string
          created_at: string
          id: string
          quantity: number
          total_price: number
          unit_price: number
        }
        Insert: {
          addon_id: string
          booking_id: string
          created_at?: string
          id?: string
          quantity?: number
          total_price: number
          unit_price: number
        }
        Update: {
          addon_id?: string
          booking_id?: string
          created_at?: string
          id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_addons_addon_id_fkey"
            columns: ["addon_id"]
            isOneToOne: false
            referencedRelation: "addons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_addons_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      booking_stops: {
        Row: {
          address: string
          booking_id: string
          created_at: string
          id: string
          latitude: number | null
          longitude: number | null
          stop_order: number
        }
        Insert: {
          address: string
          booking_id: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          stop_order: number
        }
        Update: {
          address?: string
          booking_id?: string
          created_at?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          stop_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "booking_stops_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          actual_end_at: string | null
          actual_start_at: string | null
          base_price: number
          booking_code: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          client_id: string
          company_id: string
          company_payout: number
          created_at: string
          departure_date: string
          destination_address: string
          destination_latitude: number | null
          destination_longitude: number | null
          driver_id: string | null
          dynamic_multiplier: number
          estimated_duration_hours: number | null
          id: string
          is_round_trip: boolean | null
          origin_address: string
          origin_latitude: number | null
          origin_longitude: number | null
          passengers: number
          payout_scheduled_date: string | null
          payout_status: string | null
          platform_fee: number
          rejection_reason: string | null
          return_date: string | null
          security_deposit: number
          status: Database["public"]["Enums"]["booking_status"]
          total_distance_km: number
          total_price: number
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          actual_end_at?: string | null
          actual_start_at?: string | null
          base_price: number
          booking_code?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_id: string
          company_id: string
          company_payout?: number
          created_at?: string
          departure_date: string
          destination_address: string
          destination_latitude?: number | null
          destination_longitude?: number | null
          driver_id?: string | null
          dynamic_multiplier?: number
          estimated_duration_hours?: number | null
          id?: string
          is_round_trip?: boolean | null
          origin_address: string
          origin_latitude?: number | null
          origin_longitude?: number | null
          passengers: number
          payout_scheduled_date?: string | null
          payout_status?: string | null
          platform_fee?: number
          rejection_reason?: string | null
          return_date?: string | null
          security_deposit?: number
          status?: Database["public"]["Enums"]["booking_status"]
          total_distance_km: number
          total_price: number
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          actual_end_at?: string | null
          actual_start_at?: string | null
          base_price?: number
          booking_code?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          client_id?: string
          company_id?: string
          company_payout?: number
          created_at?: string
          departure_date?: string
          destination_address?: string
          destination_latitude?: number | null
          destination_longitude?: number | null
          driver_id?: string | null
          dynamic_multiplier?: number
          estimated_duration_hours?: number | null
          id?: string
          is_round_trip?: boolean | null
          origin_address?: string
          origin_latitude?: number | null
          origin_longitude?: number | null
          passengers?: number
          payout_scheduled_date?: string | null
          payout_status?: string | null
          platform_fee?: number
          rejection_reason?: string | null
          return_date?: string | null
          security_deposit?: number
          status?: Database["public"]["Enums"]["booking_status"]
          total_distance_km?: number
          total_price?: number
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          average_rating: number | null
          cancellation_count: number | null
          cnpj: string
          created_at: string
          description: string | null
          email: string
          id: string
          interest_free_installments: number | null
          legal_name: string | null
          logo_url: string | null
          max_installments: number | null
          monthly_fee: number | null
          name: string
          operating_regions: string[] | null
          phone: string | null
          status: string
          stripe_account_id: string | null
          total_reviews: number | null
          transaction_fee: number | null
          updated_at: string
        }
        Insert: {
          average_rating?: number | null
          cancellation_count?: number | null
          cnpj: string
          created_at?: string
          description?: string | null
          email: string
          id?: string
          interest_free_installments?: number | null
          legal_name?: string | null
          logo_url?: string | null
          max_installments?: number | null
          monthly_fee?: number | null
          name: string
          operating_regions?: string[] | null
          phone?: string | null
          status?: string
          stripe_account_id?: string | null
          total_reviews?: number | null
          transaction_fee?: number | null
          updated_at?: string
        }
        Update: {
          average_rating?: number | null
          cancellation_count?: number | null
          cnpj?: string
          created_at?: string
          description?: string | null
          email?: string
          id?: string
          interest_free_installments?: number | null
          legal_name?: string | null
          logo_url?: string | null
          max_installments?: number | null
          monthly_fee?: number | null
          name?: string
          operating_regions?: string[] | null
          phone?: string | null
          status?: string
          stripe_account_id?: string | null
          total_reviews?: number | null
          transaction_fee?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      company_addresses: {
        Row: {
          city: string
          company_id: string
          complement: string | null
          created_at: string
          id: string
          is_primary: boolean | null
          neighborhood: string
          number: string
          state: string
          street: string
          zip_code: string
        }
        Insert: {
          city: string
          company_id: string
          complement?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          neighborhood: string
          number: string
          state: string
          street: string
          zip_code: string
        }
        Update: {
          city?: string
          company_id?: string
          complement?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean | null
          neighborhood?: string
          number?: string
          state?: string
          street?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_addresses_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      demand_snapshots: {
        Row: {
          available_vehicles: number
          calculated_multiplier: number
          id: string
          occupancy_rate: number | null
          route_hash: string
          search_count: number
          snapshot_at: string
          travel_date: string
        }
        Insert: {
          available_vehicles?: number
          calculated_multiplier?: number
          id?: string
          occupancy_rate?: number | null
          route_hash: string
          search_count?: number
          snapshot_at?: string
          travel_date: string
        }
        Update: {
          available_vehicles?: number
          calculated_multiplier?: number
          id?: string
          occupancy_rate?: number | null
          route_hash?: string
          search_count?: number
          snapshot_at?: string
          travel_date?: string
        }
        Relationships: []
      }
      dispute_evidences: {
        Row: {
          created_at: string
          description: string | null
          dispute_id: string
          file_key: string | null
          file_size_bytes: number
          file_type: string
          file_url: string
          id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          dispute_id: string
          file_key?: string | null
          file_size_bytes: number
          file_type: string
          file_url: string
          id?: string
          uploaded_by: string
        }
        Update: {
          created_at?: string
          description?: string | null
          dispute_id?: string
          file_key?: string | null
          file_size_bytes?: number
          file_type?: string
          file_url?: string
          id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispute_evidences_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_evidences_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          booking_id: string
          category: Database["public"]["Enums"]["dispute_category"]
          client_id: string
          company_id: string
          company_responded_at: string | null
          company_response: string | null
          company_response_deadline: string
          created_at: string
          description: string
          id: string
          penalty_amount: number | null
          refund_percentage: number | null
          resolution: Database["public"]["Enums"]["dispute_resolution"] | null
          resolution_justification: string | null
          resolved_at: string | null
          resolved_by: string | null
          status: Database["public"]["Enums"]["dispute_status"]
          updated_at: string
        }
        Insert: {
          booking_id: string
          category: Database["public"]["Enums"]["dispute_category"]
          client_id: string
          company_id: string
          company_responded_at?: string | null
          company_response?: string | null
          company_response_deadline: string
          created_at?: string
          description: string
          id?: string
          penalty_amount?: number | null
          refund_percentage?: number | null
          resolution?: Database["public"]["Enums"]["dispute_resolution"] | null
          resolution_justification?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          updated_at?: string
        }
        Update: {
          booking_id?: string
          category?: Database["public"]["Enums"]["dispute_category"]
          client_id?: string
          company_id?: string
          company_responded_at?: string | null
          company_response?: string | null
          company_response_deadline?: string
          created_at?: string
          description?: string
          id?: string
          penalty_amount?: number | null
          refund_percentage?: number | null
          resolution?: Database["public"]["Enums"]["dispute_resolution"] | null
          resolution_justification?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          status?: Database["public"]["Enums"]["dispute_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "disputes_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          document_type: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["document_entity_type"]
          expiry_date: string | null
          file_key: string | null
          file_url: string
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          uploaded_at: string
        }
        Insert: {
          document_type: string
          entity_id: string
          entity_type: Database["public"]["Enums"]["document_entity_type"]
          expiry_date?: string | null
          file_key?: string | null
          file_url: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          uploaded_at?: string
        }
        Update: {
          document_type?: string
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["document_entity_type"]
          expiry_date?: string | null
          file_key?: string | null
          file_url?: string
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          cnh_category: string
          cnh_expiry_date: string
          cnh_number: string
          company_id: string
          cpf: string
          created_at: string
          first_name: string
          id: string
          last_name: string
          phone: string | null
          photo_url: string | null
          status: string
          updated_at: string
        }
        Insert: {
          cnh_category: string
          cnh_expiry_date: string
          cnh_number: string
          company_id: string
          cpf: string
          created_at?: string
          first_name: string
          id?: string
          last_name: string
          phone?: string | null
          photo_url?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          cnh_category?: string
          cnh_expiry_date?: string
          cnh_number?: string
          company_id?: string
          cpf?: string
          created_at?: string
          first_name?: string
          id?: string
          last_name?: string
          phone?: string | null
          photo_url?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      garages: {
        Row: {
          city: string
          company_id: string
          complement: string | null
          created_at: string
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          neighborhood: string | null
          number: string
          state: string
          street: string
          updated_at: string
          zip_code: string
        }
        Insert: {
          city: string
          company_id: string
          complement?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          neighborhood?: string | null
          number: string
          state: string
          street: string
          updated_at?: string
          zip_code: string
        }
        Update: {
          city?: string
          company_id?: string
          complement?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          neighborhood?: string | null
          number?: string
          state?: string
          street?: string
          updated_at?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "garages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      locked_quotes: {
        Row: {
          base_price: number
          client_id: string | null
          created_at: string
          final_price: number
          id: string
          is_used: boolean | null
          locked_until: string
          multiplier: number
          route_destination: string
          route_origin: string
          travel_date: string
          vehicle_id: string
        }
        Insert: {
          base_price: number
          client_id?: string | null
          created_at?: string
          final_price: number
          id?: string
          is_used?: boolean | null
          locked_until: string
          multiplier: number
          route_destination: string
          route_origin: string
          travel_date: string
          vehicle_id: string
        }
        Update: {
          base_price?: number
          client_id?: string | null
          created_at?: string
          final_price?: number
          id?: string
          is_used?: boolean | null
          locked_until?: string
          multiplier?: number
          route_destination?: string
          route_origin?: string
          travel_date?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "locked_quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "locked_quotes_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string
          created_at: string
          id: string
          is_read: boolean | null
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_applications: {
        Row: {
          additional_docs_request: string | null
          address_city: string | null
          address_complement: string | null
          address_number: string | null
          address_state: string | null
          address_street: string | null
          address_zip: string | null
          antt_file_url: string | null
          approved_monthly_fee: number | null
          approved_transaction_fee: number | null
          cnpj: string
          company_id: string | null
          company_phone: string | null
          created_at: string
          description: string | null
          estimated_vehicle_count: string | null
          id: string
          legal_name: string
          operating_regions: string[] | null
          permit_file_url: string | null
          rejection_reason: string | null
          representative_cpf: string
          representative_email: string
          representative_name: string
          representative_phone: string
          representative_role: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          social_contract_file_url: string | null
          status: Database["public"]["Enums"]["partner_application_status"]
          trade_name: string
          updated_at: string
          vehicle_types: string[] | null
        }
        Insert: {
          additional_docs_request?: string | null
          address_city?: string | null
          address_complement?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          antt_file_url?: string | null
          approved_monthly_fee?: number | null
          approved_transaction_fee?: number | null
          cnpj: string
          company_id?: string | null
          company_phone?: string | null
          created_at?: string
          description?: string | null
          estimated_vehicle_count?: string | null
          id?: string
          legal_name: string
          operating_regions?: string[] | null
          permit_file_url?: string | null
          rejection_reason?: string | null
          representative_cpf: string
          representative_email: string
          representative_name: string
          representative_phone: string
          representative_role?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_contract_file_url?: string | null
          status?: Database["public"]["Enums"]["partner_application_status"]
          trade_name: string
          updated_at?: string
          vehicle_types?: string[] | null
        }
        Update: {
          additional_docs_request?: string | null
          address_city?: string | null
          address_complement?: string | null
          address_number?: string | null
          address_state?: string | null
          address_street?: string | null
          address_zip?: string | null
          antt_file_url?: string | null
          approved_monthly_fee?: number | null
          approved_transaction_fee?: number | null
          cnpj?: string
          company_id?: string | null
          company_phone?: string | null
          created_at?: string
          description?: string | null
          estimated_vehicle_count?: string | null
          id?: string
          legal_name?: string
          operating_regions?: string[] | null
          permit_file_url?: string | null
          rejection_reason?: string | null
          representative_cpf?: string
          representative_email?: string
          representative_name?: string
          representative_phone?: string
          representative_role?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          social_contract_file_url?: string | null
          status?: Database["public"]["Enums"]["partner_application_status"]
          trade_name?: string
          updated_at?: string
          vehicle_types?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_applications_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "partner_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_events: {
        Row: {
          affected_regions: string[] | null
          created_at: string
          created_by: string | null
          end_date: string
          id: string
          is_active: boolean | null
          minimum_multiplier_level: string
          name: string
          start_date: string
        }
        Insert: {
          affected_regions?: string[] | null
          created_at?: string
          created_by?: string | null
          end_date: string
          id?: string
          is_active?: boolean | null
          minimum_multiplier_level?: string
          name: string
          start_date: string
        }
        Update: {
          affected_regions?: string[] | null
          created_at?: string
          created_by?: string | null
          end_date?: string
          id?: string
          is_active?: boolean | null
          minimum_multiplier_level?: string
          name?: string
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_id: string | null
          cpf: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string
          id: string
          is_active: boolean | null
          kyc_status: string
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          company_id?: string | null
          cpf?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name: string
          id: string
          is_active?: boolean | null
          kyc_status?: string
          last_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          company_id?: string | null
          cpf?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string
          id?: string
          is_active?: boolean | null
          kyc_status?: string
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      review_responses: {
        Row: {
          created_at: string
          id: string
          responder_id: string
          response: string
          review_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          responder_id: string
          response: string
          review_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          responder_id?: string
          response?: string
          review_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_responses_responder_id_fkey"
            columns: ["responder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_responses_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: true
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string
          client_id: string
          comment: string | null
          company_id: string
          created_at: string
          driver_rating: number
          id: string
          overall_rating: number
          punctuality_rating: number
          status: string
          updated_at: string
          value_rating: number
          vehicle_id: string
          vehicle_rating: number
        }
        Insert: {
          booking_id: string
          client_id: string
          comment?: string | null
          company_id: string
          created_at?: string
          driver_rating: number
          id?: string
          overall_rating: number
          punctuality_rating: number
          status?: string
          updated_at?: string
          value_rating: number
          vehicle_id: string
          vehicle_rating: number
        }
        Update: {
          booking_id?: string
          client_id?: string
          comment?: string | null
          company_id?: string
          created_at?: string
          driver_rating?: number
          id?: string
          overall_rating?: number
          punctuality_rating?: number
          status?: string
          updated_at?: string
          value_rating?: number
          vehicle_id?: string
          vehicle_rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          updated_by: string | null
          value: string
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          updated_by?: string | null
          value: string
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          booking_id: string
          created_at: string
          id: string
          qr_hash: string
          qr_payload: string
          status: string
          ticket_code: string
          used_at: string | null
          validated_by: string | null
        }
        Insert: {
          booking_id: string
          created_at?: string
          id?: string
          qr_hash: string
          qr_payload: string
          status?: string
          ticket_code: string
          used_at?: string | null
          validated_by?: string | null
        }
        Update: {
          booking_id?: string
          created_at?: string
          id?: string
          qr_hash?: string
          qr_payload?: string
          status?: string
          ticket_code?: string
          used_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_validated_by_fkey"
            columns: ["validated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          refund_percentage: number | null
          status: string
          stripe_charge_id: string | null
          stripe_payment_intent_id: string | null
          stripe_transfer_id: string | null
          type: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          refund_percentage?: number | null
          status: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          type: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          refund_percentage?: number | null
          status?: string
          stripe_charge_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_transfer_id?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_amenities: {
        Row: {
          amenity_id: string
          vehicle_id: string
        }
        Insert: {
          amenity_id: string
          vehicle_id: string
        }
        Update: {
          amenity_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_amenities_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_photos: {
        Row: {
          created_at: string
          display_order: number
          file_key: string | null
          file_url: string
          id: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          display_order?: number
          file_key?: string | null
          file_url: string
          id?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          display_order?: number
          file_key?: string | null
          file_url?: string
          id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_photos_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          average_rating: number | null
          capacity: number
          company_id: string
          created_at: string
          dynamic_pricing_enabled: boolean | null
          garage_id: string
          id: string
          min_departure_cost: number
          model: string
          plate: string
          price_per_km: number
          status: string
          total_reviews: number | null
          updated_at: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          average_rating?: number | null
          capacity: number
          company_id: string
          created_at?: string
          dynamic_pricing_enabled?: boolean | null
          garage_id: string
          id?: string
          min_departure_cost: number
          model: string
          plate: string
          price_per_km: number
          status?: string
          total_reviews?: number | null
          updated_at?: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          average_rating?: number | null
          capacity?: number
          company_id?: string
          created_at?: string
          dynamic_pricing_enabled?: boolean | null
          garage_id?: string
          id?: string
          min_departure_cost?: number
          model?: string
          plate?: string
          price_per_km?: number
          status?: string
          total_reviews?: number | null
          updated_at?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_garage_id_fkey"
            columns: ["garage_id"]
            isOneToOne: false
            referencedRelation: "garages"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      current_user_company_id: { Args: never; Returns: string }
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      is_super_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      addon_pricing_type: "FIXED" | "PER_PERSON" | "PACKAGE"
      booking_status:
        | "PENDING_APPROVAL"
        | "PENDING_PAYMENT"
        | "CONFIRMED"
        | "IN_PROGRESS"
        | "PENDING_COMPLETION"
        | "COMPLETED"
        | "CANCELLED_BY_CLIENT"
        | "CANCELLED_BY_COMPANY"
        | "REJECTED"
        | "EXPIRED"
        | "NO_SHOW_CLIENT"
        | "NO_SHOW_COMPANY"
      dispute_category:
        | "VEHICLE_DIFFERENT"
        | "DELAY"
        | "SAFETY"
        | "DRIVER"
        | "AMENITIES"
        | "NO_SHOW_COMPANY"
        | "OTHER"
      dispute_resolution:
        | "FULL_REFUND"
        | "PARTIAL_REFUND"
        | "DISMISSED"
        | "PENALTY"
      dispute_status: "OPEN" | "IN_REVIEW" | "ESCALATED" | "RESOLVED"
      document_entity_type: "COMPANY" | "VEHICLE" | "DRIVER"
      partner_application_status:
        | "PENDING_APPROVAL"
        | "APPROVED"
        | "REJECTED"
        | "PENDING_DOCUMENTS"
      user_role:
        | "CLIENT"
        | "SUPER_ADMIN"
        | "COMPANY_ADMIN"
        | "COMPANY_OPERATOR"
        | "COMPANY_FINANCIAL"
      vehicle_type: "BUS" | "MINIBUS" | "VAN"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      addon_pricing_type: ["FIXED", "PER_PERSON", "PACKAGE"],
      booking_status: [
        "PENDING_APPROVAL",
        "PENDING_PAYMENT",
        "CONFIRMED",
        "IN_PROGRESS",
        "PENDING_COMPLETION",
        "COMPLETED",
        "CANCELLED_BY_CLIENT",
        "CANCELLED_BY_COMPANY",
        "REJECTED",
        "EXPIRED",
        "NO_SHOW_CLIENT",
        "NO_SHOW_COMPANY",
      ],
      dispute_category: [
        "VEHICLE_DIFFERENT",
        "DELAY",
        "SAFETY",
        "DRIVER",
        "AMENITIES",
        "NO_SHOW_COMPANY",
        "OTHER",
      ],
      dispute_resolution: [
        "FULL_REFUND",
        "PARTIAL_REFUND",
        "DISMISSED",
        "PENALTY",
      ],
      dispute_status: ["OPEN", "IN_REVIEW", "ESCALATED", "RESOLVED"],
      document_entity_type: ["COMPANY", "VEHICLE", "DRIVER"],
      partner_application_status: [
        "PENDING_APPROVAL",
        "APPROVED",
        "REJECTED",
        "PENDING_DOCUMENTS",
      ],
      user_role: [
        "CLIENT",
        "SUPER_ADMIN",
        "COMPANY_ADMIN",
        "COMPANY_OPERATOR",
        "COMPANY_FINANCIAL",
      ],
      vehicle_type: ["BUS", "MINIBUS", "VAN"],
    },
  },
} as const
