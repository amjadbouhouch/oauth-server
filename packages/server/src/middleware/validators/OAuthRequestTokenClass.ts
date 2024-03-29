import { Expose } from 'class-transformer';
import { IsDefined, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { grantTypes, grantType } from 'utils';

/**
 * Validator for requesting token
 * Method: `POST`
 *
 */
export class OAuthRequestTokenClass {
  @IsEnum(grantTypes)
  @IsString()
  @Expose()
  grant_type: grantType;

  @IsDefined()
  @Expose()
  @IsString()
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
export class OAuthResourceOwnerPasswordCredentialsClass {
  @IsEnum(grantTypes)
  @Expose()
  grant_type: grantType = 'resource_owner_password_credentials';

  @IsDefined()
  @Expose()
  @IsString()
  password: string;

  @IsDefined()
  @Expose()
  @IsString()
  @IsEmail()
  email: string;

  @IsDefined()
  @Expose()
  @IsString()
  client_id: string;
}
