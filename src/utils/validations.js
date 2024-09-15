import { t } from 'boot/i18n'
import * as yup from 'yup'
export const emailRegex = /^\S+@\S+\.\S+$/

export const ERRORS = {
  REQUIRED: t('validation.required'),
  INVALID_EMAIL: t('validation.invalidEmail')
}

const requiredNumberSchema = yup.number().required(ERRORS.REQUIRED)
const requiredStringSchema = yup.string().required(ERRORS.REQUIRED)
const emailSchema = yup.string().matches(emailRegex, ERRORS.INVALID_EMAIL)

export const notEmptyNumber = (val) => requiredNumberSchema.isValidSync(val) || ERRORS.REQUIRED
export const notEmpty = (val) => requiredStringSchema.isValidSync(val) || ERRORS.REQUIRED
export const testEmail = (val) => emailSchema.isValidSync(val) || ERRORS.INVALID_EMAIL

export default {
  notEmpty,
  notEmptyNumber,
  testEmail
}
