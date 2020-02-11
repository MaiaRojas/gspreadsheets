const getEmail = (user) => user.toLowerCase().slice(user.indexOf('(') + 1, user.length - 1);
const processData = (data, questions) =>
  data
    .slice(1)
    .map((row) => {
      const objResult = Object.values(questions)
        .reduce(
          (memo, key, index) => ({
            ...memo,
            ...(key.toLowerCase() === 'user'
              ? {user: row[index], email: getEmail(row[index]).toLowerCase()}
              : {[key.toLowerCase()]: row[index]}),
          }), {});
      return objResult;
    });

const allEmails = (data) => {
  const emails = data.reduce((acc, current) => (
    [ ...acc, getEmail(current.user)]), []
  )
  return [...(new Set(emails))];
};

exports.convertData = (data, questions) => {
  const transformedData = processData(data, questions);
  const emails = allEmails(transformedData);

  return emails.reduce((acc, email) => {
    const projects = transformedData.filter(elem => elem.email === email);
    return {
      ...acc,
      [email]: projects,
    }
  }, {});
}
