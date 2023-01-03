import addFiles from "./addFiles/addFiles";
import post from "./post/post";
import validate from "./validate/validate";
import antispam from "./antispam/antispam";

const forms = ({
  formSelector = `.js-form`,
  enabledValidaton = true,
  enabledAddFiles = true,
  enabledPost = true,
  enabledAntispam = false,
}) => {
  const formsElements = document.querySelectorAll(formSelector);

  if (formsElements.length) {
    formsElements.forEach((form) => {
      const state = {
        url: form.action,
        isActive: false,
        validate: {
          text: true,
          radio: false,
          addAdditionalInputs: false,
        },
      };
      if (enabledAntispam) {
        antispam({form});
      }

      if (enabledValidaton) {
        validate({form, state});
      }
      if (enabledAddFiles) {
        addFiles({form});
      }
      if (enabledPost) {
        post({form, state});
      } else {
        form.addEventListener(`submit`, (evt) => {
          if (!state.isActive) {
            evt.preventDefault();
          } else {
            evt.stopPropagation();
          }
        });
      }
    });
  }
};

export default forms;
