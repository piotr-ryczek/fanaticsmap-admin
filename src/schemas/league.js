import * as yup from "yup";

export default yup.object().shape({
  name: yup.string().required("formErrors.required"),
  downloadUrl: yup.string(),
  downloadType: yup.string(),
  clubs: yup.array(),
  importanceModifier: yup.number(),
  seasonStartYear: yup.number(),
  seasonEndYear: yup.number(),
  seasonMonthUntil: yup.number(),
});
