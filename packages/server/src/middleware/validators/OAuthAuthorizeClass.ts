import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { grantTypes, grantType } from 'utils';

/**
 * Validator for requesting token
 * Method: `POST`
 *
 */
export class OAuthAuthorizeClass {
  @IsEnum(grantTypes, {
    message: 'grant_type not valid',
  })
  @Expose()
  grant_type: grantType;

  @IsDefined()
  @Expose()
  @IsEmail()
  email: string;

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
