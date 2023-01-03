
const validate = ({ form, state }) => {
  let requiredInputElements = form.querySelectorAll(`.js-required`);
  const requiredRadioInputElements = form.querySelectorAll(`.js-required-radio`);
  const addAdditionalElements = form.querySelectorAll(`.js-required-add-new-inputs`);
  const submitButtonElement = form.querySelector(`.js-submit`);

  const filledData = [];

  const radioInputNames = [];

  const ValidateType = {
    PHONE: `PHONE`,
    EMAIL: `EMAIL`,
    INDEX: `INDEX`,
  };

  const ValidateMessage = {
    PHONE: `Необходимый формат номера телефона: 8XXXXXXXXXX`,
    EMAIL: `Необходимый формат электронного адреса: user@default.com`,
    INDEX: `Необходимый формат индекса: XXXXXX`,
  };

  const RegularExp = {
    PHONE: /^[+0-9]{1}[(0-9]{2}[0-9]{2}[)0-9]{2}[0-9]{4,7}$/,
    EMAIL: /\S+\@\S+\.[a-z]+/i,
    INDEX: /^\d{6}$/,
  };

  const activateSubmitForm = () => (state.isActive = true);
  const deactivateSubmitForm = () => (state.isActive = false);

  const getRequiredInputs = () => form.querySelectorAll(`.js-required`);

  const showError = () => {
    requiredInputElements.forEach((element) => {
      if (!element.classList.contains(`fill`)) {
        element.classList.add(`error`);
      }
    });

    radioInputNames.forEach((radioName) => {
      if (!form[radioName].value.length) {
        form.querySelectorAll(`[name="${radioName}"]`).forEach((element) => {
          element.classList.add(`error`);
        });
      }
    });
  };

  const removeFilledFromData = (element) => {
    if (filledData.includes(element)) {
      const index = filledData.indexOf(element);
      filledData.splice(index, 1);
    }
  };

  const addFilledToData = (element) => {
    if (!filledData.includes(element)) {
      filledData.push(element);
    }
  };

  const validateTextInput = (evt) => {
    if (evt.target.value.length > 0) {
      evt.target.classList.add(`fill`);
      evt.target.classList.remove(`error`);
      addFilledToData(evt.target);
    } else {
      evt.target.classList.remove(`fill`);
      removeFilledFromData(evt.target);
    }

    if (evt.target.dataset.validateType === `email`) {
      validateUserInput(evt, ValidateType.EMAIL, ValidateMessage.EMAIL);
    }

    if (evt.target.dataset.validateType === `phone`) {
      validateUserInput(evt, ValidateType.PHONE, ValidateMessage.PHONE);
    }

    if (evt.target.dataset.validateType === `index`) {
      validateUserInput(evt, ValidateType.INDEX, ValidateMessage.INDEX);
    }
  };

  const validateUserInput = (evt, validateType, message) => {
    switch (validateType) {
      case ValidateType.PHONE:
        if (evt.target.value.match(RegularExp[validateType]) === null) {
          evt.target.setCustomValidity(message);
        } else {
          evt.target.setCustomValidity(``);
        }
        break;
      default:
        if (evt.target.value.match(RegularExp[validateType]) === null) {
          evt.target.setCustomValidity(message);
        } else {
          evt.target.setCustomValidity(``);
        }
        break;
    }
  };

  // Поиск всех имен радио инпутов
  const fillRadioNames = () => {
    requiredRadioInputElements.forEach((input) => radioInputNames.push(input.name));
  };

  // Проверка на выполнение условия валидации радио инпутов
  const filledRadioInputs = () => {
    let result = true;

    radioInputNames.forEach((radioName) => {
      if (!form[radioName].value.length) {
        result = false;
      }
    });

    return result;
  };

  // Информирование пользователя при валидации радио инпутов, добавляется класс к инпуту
  const setErrorClassRadioInputs = (evt) => {
    form.querySelectorAll(`[name="${evt.target.name}"]`).forEach((element) => {
      if (element.classList.contains(`error`)) {
        element.classList.remove(`error`);
      }
    });
  };

  // Активация/деактивация формы и кнопки
  const activateSubmitButton = () => {
    if (state.validate.text && state.validate.radio) {
      if (filledData.length === requiredInputElements.length && filledRadioInputs()) {
        submitButtonElement.classList.remove(`disabled`);
        activateSubmitForm();
      } else {
        if (!submitButtonElement.classList.contains(`disabled`)) {
          submitButtonElement.classList.add(`disabled`);
        }
        deactivateSubmitForm();
      }
    } else if (state.validate.text) {
      if (filledData.length === requiredInputElements.length) {
        submitButtonElement.classList.remove(`disabled`);
        activateSubmitForm();
      } else {
        if (!submitButtonElement.classList.contains(`disabled`)) {
          submitButtonElement.classList.add(`disabled`);
        }
        deactivateSubmitForm();
      }
    }
  };

  // Иницаилизация параметров
  const initialParameters = () => {
    if (requiredRadioInputElements.length) {
      state.validate.radio = true;
      fillRadioNames();
    }

    if (!requiredInputElements.length) {
      state.validate.text = false;
    }

    if (addAdditionalElements.length) {
      state.validate.addAdditionalInputs = true;
    }
  };

  // Добавляем обработчики для тектовых инпутов
  const addTextInputEvents = (input) => {
    input.addEventListener(`input`, validateTextInput);
    input.addEventListener(`input`, activateSubmitButton);
  };
  // Удаляем обработчики у текстовых инпутов
  const removeTextInputEvents = (input) => {
    input.removeEventListener(`input`, validateTextInput);
    input.removeEventListener(`input`, activateSubmitButton);
  };

  // первичная инициализация формы
  const initialForm = () => {
    deactivateSubmitForm();
    initialParameters();
  };

  // Включение валидации дополнительных инпутов
  const enableAdditionalInputValidation = (toggleElement) => {
    const formName = toggleElement.name;
    const additionalInputsSelector = toggleElement.dataset.newInputsSelector;
    const additionalInputsElements = form.querySelectorAll(additionalInputsSelector);

    let validateAdditionalInputs = false;

    form[formName].forEach((element) => {
      element.addEventListener(`click`, (evt) => {
        if (evt.target === toggleElement) {
          validateAdditionalInputs = true;
        } else {
          validateAdditionalInputs = false;
        }

        additionalInputsElements.forEach((input) => {
          if (validateAdditionalInputs) {
            input.classList.add(`js-required`);

            addTextInputEvents(input);

            if (input.value.length) {
              addFilledToData(input);
            }
          } else {
            input.classList.remove(`js-required`);
            input.classList.remove(`error`);

            removeFilledFromData(input);
            removeTextInputEvents(input);
          }
        });
        requiredInputElements = getRequiredInputs();
      });
    });
  };

  initialForm();

  // Добавляем валидацию дополнительным инпутам
  if (state.validate.addAdditionalInputs) {
    addAdditionalElements.forEach((element) => enableAdditionalInputValidation(element));
  }

  if (state.validate.text) {
    requiredInputElements.forEach((input) => {
      addTextInputEvents(input);
    });
  }

  if (state.validate.radio) {
    form.addEventListener(`change`, setErrorClassRadioInputs);
    form.addEventListener(`change`, activateSubmitButton);
  }

  submitButtonElement.addEventListener(`mouseover`, showError);
};

export default validate;
