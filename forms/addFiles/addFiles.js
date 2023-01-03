import {renderElement} from "../../utils/common";

const addFiles = ({form}) => {
  const addFileElements = form.querySelectorAll(`.js-add-file`);
  const FILE_TYPES = [`jpg`, `jpeg`, `png`];
  const MAX_FILE_SIZE = 500000;

  const getTemplateFileName = (name) =>
    `<span class="forms__file-text forms__file-text--name js-files">${name}</span>`;

  const addFile = (fileChooserInput) => {
    const files = fileChooserInput.files;
    const parent = fileChooserInput.parentNode;
    const filesElements = parent.querySelectorAll(`.js-files`);

    let exceededMaximumSize = false;
    let invalidFileType = false;

    filesElements.forEach((element) => element.remove());

    if (files.length <= 5) {
      for (const key in files) {
        if (key === `length`) {
          break;
        }

        const file = files[key];

        if (file.size > MAX_FILE_SIZE) {
          exceededMaximumSize = true;
          break;
        }

        const fileName = file.name.toLowerCase();

        const matches = FILE_TYPES.some((it) => {
          return fileName.endsWith(it);
        });

        if (!matches) {
          invalidFileType = true;
          parent.querySelectorAll(`.js-files`).forEach((element) => element.remove());
          break;
        } else {
          let reader = new FileReader();
          reader.addEventListener(`load`, () => {
            renderElement(parent, getTemplateFileName(fileName));
          });
          reader.readAsDataURL(file);
        }
      }

      if (invalidFileType) {
        fileChooserInput.value = ``;
        renderElement(
          parent,
          getTemplateFileName(
            `Неверный формат одного из файлов, разрешенные форматы: ${FILE_TYPES.map(
              (element) => element,
            ).join(`, `)}`,
          ),
        );
      }

      if (exceededMaximumSize) {
        fileChooserInput.value = ``;
        renderElement(
          parent,
          getTemplateFileName(
            `Превышен максимальный размер одного или нескольких файлов. Максимальный размер одного файла 500kb`,
          ),
        );
      }
    } else {
      fileChooserInput.value = ``;
      renderElement(
        parent,
        getTemplateFileName(`Максимальное количество прикрепляемых файлов - 5 штук`),
      );
    }
  };

  if (addFileElements.length) {
    addFileElements.forEach((element) => {
      const fileChooserElement = element.querySelector(`.js-add-file-input`);

      fileChooserElement.addEventListener(`change`, () => {
        addFile(fileChooserElement);
      });
    });
  }
};

export default addFiles;
