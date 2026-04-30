import { BadRequestException, PipeTransform } from '@nestjs/common';
import { ZodSchema, ZodError } from 'zod';

export class ZodValidationPipe<T extends ZodSchema> implements PipeTransform {
  constructor(private readonly schema: T) {}

  transform(value: unknown): unknown {
    try {
      return this.schema.parse(value);
    } catch (err) {
      if (err instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validation failed',
          errors: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
            code: e.code,
          })),
        });
      }
      throw err;
    }
  }
}
