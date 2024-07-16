export const profileIsComplete = (user) => {
  const totalEntries = 5;
  let emptyEntries = 0;

  if (
    !user.name ||
    !user.address ||
    !user.phoneNumber ||
    !user.longitude ||
    !user.latitude
  )
    emptyEntries++;

  return Math.floor(((totalEntries - emptyEntries) / totalEntries) * 100);
};
export const profileIsCompleteVendor = (user) => {
  const totalEntries = 5;
  let emptyEntries = 0;

  if (
    !user.name ||
    !user.address ||
    !user.phoneNumber ||
    !user.location.coordinates[0] ||
    !user.location.coordinates[1]
  )
    emptyEntries++;

  return Math.floor(((totalEntries - emptyEntries) / totalEntries) * 100);
};
