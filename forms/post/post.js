import {postData} from "../../utils/common";

const post = ({form, state}) => {
  const AnswerType = {
    FAIL: `FAIL`,
    SUCCES: `SUCCES`,
  };

  const answerElement = form.querySelector(`.js-answer`);
  const loaderElement = answerElement.querySelector(`.js-preloader`);

  const enableAnswer = (answerType) => {
    let textElement;
    switch (answerType) {
      case AnswerType.SUCCES:
        textElement = answerElement.querySelector(`.js-success`);
        break;
      case AnswerType.FAIL:
        textElement = answerElement.querySelector(`.js-fail`);
        break;
    }

    loaderElement.classList.add(`hide`);
    textElement.classList.add(`show`);

    const timerId = setTimeout(() => {
      clearTimeout(timerId);

      answerElement.classList.remove(`show`);
      loaderElement.classList.remove(`hide`);
      textElement.classList.remove(`show`);

      if (answerType === AnswerType.SUCCES) {
        form.reset();
        form.querySelectorAll(`.js-files`).forEach((element) => element.remove());
        form.querySelector(`.js-submit`).classList.add(`disabled`);
        state.isActive = false;
      }
    }, 3000);
  };

  form.addEventListener(`submit`, (evt) => {
    evt.preventDefault();

    if (state.isActive) {
      answerElement.classList.add(`show`);
      const formData = new FormData(form);
      postData(formData, state.url)
        .then((data) => {
          if (data === 200) {
            enableAnswer(AnswerType.SUCCES);
            if (window.ym) {
              ym(91893972, "reachGoal", "send-form");
            }
          } else {
            enableAnswer(AnswerType.FAIL);
          }
        })
        .catch((error) => {
          console.log(error);
          enableAnswer(AnswerType.FAIL);
        });
    }
  });
};

export default post;
