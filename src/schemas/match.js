import * as yup from 'yup';

export default yup.object().shape({
  homeClub: yup
    .mixed()
    .required('formErrors.required'),
  isHomeClubReserve: yup
    .boolean()
    .default(false)
    .required('formErrors.required'),
  awayClub: yup
    .mixed()
    .required('formErrors.required'),
  isAwayClubReserve: yup
    .boolean()
    .default(false)
    .required('formErrors.required'),
  importance: yup
    .number()
    .min(0)
    .max(20)
    .required('formErrors.required'),
  attitude: yup
    .number()
    .min(0)
    .max(100)
    .required('formErrors.required'),
  league: yup
    .string()
    .nullable()
});
