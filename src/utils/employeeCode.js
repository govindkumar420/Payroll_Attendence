const getNextEmployeeCode = (existingEmployees, prefix = "200") => {
  const numericCodes = existingEmployees
    .map((employee) => parseInt(employee.id, 10))
    .filter((code) => !isNaN(code) && String(code).startsWith(prefix));

  if (numericCodes.length > 0) {
    return String(Math.max(...numericCodes) + 1);
  }

  return `${prefix}${String(existingEmployees.length + 1).padStart(3, "0")}`;
};

export { getNextEmployeeCode };
