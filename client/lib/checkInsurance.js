export default function checkInsurance(date) {
  const installationDate = new Date(date);
  const currentDate = new Date();
  const fourYearsLater = new Date(
    installationDate.setFullYear(installationDate.getFullYear() + 4)
  );

  if (currentDate < fourYearsLater) {
    return true;
  } else {
    return false;
  }
}
