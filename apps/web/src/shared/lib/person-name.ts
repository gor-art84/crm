export const getInitials = (firstName: string, lastName: string) => {
  return `${firstName.charAt(0).toUpperCase()}${lastName.charAt(0).toUpperCase()}`;
};

export const formatFullName = ({
  firstName,
  middleName,
  lastName,
}: {
  firstName: string;
  middleName?: string | null;
  lastName: string;
}) => {
  const fullNameArr = [lastName, firstName, middleName].filter(Boolean);
  return fullNameArr.join(" ");
};
