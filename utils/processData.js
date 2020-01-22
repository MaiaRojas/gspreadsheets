const questions = {
  'Timestamp': 'date',
  '¿Quién eres?': 'user',
  '¿Qué proyecto acabas de terminar?': 'project',
  'Pensando en tu bienestar, ¿crees que podrías sostener el ritmo de este mismo proyecto durante el resto del bootcamp?': 'comfort',
  '¿Por qué comfort?': 'whyComfort',
  'En general, ¿qué tan satisfecha estás con el programa hasta hoy?': 'happy',
  '¿Por qué happy?': 'whyHappy',
  '¿Sientes que Laboratoria te está preparando para el trabajo desarrollando las habilidades socioemocionales (o "blandas" o "soft skills") necesarias?': 'performance',
  '¿Sientes que Laboratoria te está preparando para el trabajo con las habilidades técnicas necesarias?': 'work',
  '¿Sientes que puedes aprender a tu propio ritmo?': 'learning',
  '¿Sientes que logramos hacer que tu experiencia de aprendizaje sea personalizada / individual?': 'experience',
  '¿Sientes que el equipo cuenta con las habilidades para guiarte adecuadamente en tu aprendizaje?': 'teamSkills',
  '¿Sientes que el equipo tiene la disponibilidad de tiempo para acompañarte y guiarte en tu aprendizaje?': 'availability',
  '¿Sientes que el equipo tiene la predisposición para acompañarte y guiarte en tu aprendizaje?': 'predisposition',
  '¿Por qué predisposition?': 'whyPredisposition',
  '¿Qué mensaje le darías a lxs miembros del equipo para mejorar? Recuerda que el feedback es un regalo :)': 'feedback',
  'Durante este proyecto, ¿alguna vez pensaste en abandonar el programa?': 'dropout',
  '¿Por qué dropout?': 'whyDropout',
  '¿Quieres comentarnos algo más?': 'comments',
};

const getEmail = (user) => user.slice(user.indexOf('(') + 1, user.length - 1);
const processData = (data, questions) =>
  data
    .slice(1)
    .map((row) => {
      const objResult = Object.values(questions)
        .reduce(
          (memo, key, index) => ({
            ...memo,
            ...(key.toLowerCase() === 'user'
              ? {user: row[index], email: getEmail(row[index])}
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

exports.convertData = (data) => {
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
