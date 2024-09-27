import type { Type } from '@nestjs/common';
import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { SwaggerMetaResponse, Meta } from '@core/type/response.type';

// Mapping response handler by type given for swagger documentation
export const MapResponseSwagger = <
  DataDto extends Type<unknown>,
  Options extends { status: number; isArray: boolean },
>(
  dataDto: DataDto,
  options: Options
) =>
  applyDecorators(
    ApiExtraModels(SwaggerMetaResponse, Meta, dataDto),
    ApiResponse({
      status: options.status,
      schema: {
        allOf: [
          { $ref: getSchemaPath(SwaggerMetaResponse) },
          {
            ...(options.isArray
              ? {
                  properties: {
                    status_code: {
                      example: options.status,
                    },
                    data: {
                      type: 'array',
                      items: { $ref: getSchemaPath(dataDto) },
                    },

                    // meta: {
                    //   $ref: getSchemaPath('Meta'),
                    // },
                  },
                }
              : {
                  properties: {
                    status_code: {
                      example: options.status,
                    },
                    data: {
                      $ref: getSchemaPath(dataDto),
                    },
                  },
                }),
          },
        ],
      },
    })
  );

// Haversine formula to calculate the distance between two lat/lng points
export const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  // Radius of the Earth in kilometers
  const R = 6371;

  const toRad = (x: number) => (x * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  return R * c;
};
