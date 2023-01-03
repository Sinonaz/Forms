// Работает только для sendmail
// Для работы необходимо добавить в форму инпут <input type="hidden" id="check" name="check">

const antispam = ({form}) => {
  const submitButtonElement = form.querySelector(`.js-submit`);

  const onSubmitButtonClick = () => (form[`check`].value = `not-spam`);

  submitButtonElement.addEventListener(`click`, onSubmitButtonClick);
};

export default antispam;
