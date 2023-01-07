import { Expose } from 'class-transformer';
import { IsDefined, IsEnum, IsOptional, IsString } from 'class-validator';
import { grantTypes, grantType } from 'utils';

/**
 * Validator for requesting token
 * Method: `POST`
 *
 */
export class OAuthRequestTokenClass {
  @IsEnum(grantTypes)
  @Expose()
  grant_type: grantType;

  @IsDefined()
  @Expose()
  @IsString()
  username: string;

  @IsDefined()
  @Expose()
  @IsString()
  password: string;

  @IsOptional()
  @Expose()
  @IsString()
  scope: string;
  @IsDefined()
  @Expose()
  @IsString()
  client_id: string;
  @Expose()
  @IsOptional()
  client_secret: string;
}
