import { ApiProperty } from '@nestjs/swagger';

export class Meta {
  @ApiProperty({ example: 10 })
  page_size: number;

  @ApiProperty({ example: 1 })
  current_page: number;

  @ApiProperty({ example: 1000 })
  total: number;

  @ApiProperty({ example: 100 })
  total_page: number;
}

export class SwaggerMetaResponse {
  status_code: number;

  @ApiProperty({ example: 'Inquiry berhasil' })
  status_description: string;
}

export interface DataOnlyRes<T> {
  data: T;
}

export interface DataWithStatusRes<T> extends DataOnlyRes<T> {
  status_description: string;
}

export interface DataWithMetaRes<T> extends DataOnlyRes<T> {
  meta: Meta;
}

export interface StatusDataMetaRes<T>
  extends DataWithMetaRes<T>,
    DataWithStatusRes<T> {}

