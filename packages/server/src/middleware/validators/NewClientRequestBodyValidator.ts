import { Client } from '@oauth/core';
import { Expose } from 'class-transformer';
import { IsArray, IsBoolean, IsDefined, IsOptional, IsString } from 'class-validator';

export class NewClientRequestBodyValidator {
  @IsDefined()
  @Expose()
  @IsString()
  clientId: Client['clientId'];

  @Expose()
  @IsDefined()
  @IsBoolean()
  @IsOptional()
  enabled: Client['enabled'] = false;

  @Expose()
  @IsDefined()
  @IsBoolean()
  @IsOptional()
  isPublic: Client['isPublic'] = true;

  @Expose()
  @IsDefined()
  @IsString()
  @IsOptional()
  name: Client['name'] = '';

  @Expose()
  @IsDefined()
  @IsArray()
  @IsString({
    each: true,
  })
  @IsOptional()
  redirectUris: string[] = [];

  @Expose()
  @IsDefined()
  @IsArray()
  @IsString({
    each: true,
  })
  @IsOptional()
  webOrigins: string[] = [];
}
