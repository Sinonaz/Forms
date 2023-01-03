export const fetchData = async (url, state) => {
  let newUrl = `${url}?id=${state.id}`;
  for (let key in state.current) {
    const str = `&${key}=${state.current[key]}`;
    newUrl = `${newUrl}${str}`;
  }

  const result = await fetch(newUrl);

  if (result.status === 200) {
    return await result.json();
  }
};

export const postData = async (data, url) => {
  const options = {
    method: `POST`,
    body: data,
  };

  const result = await fetch(url, options);
  // const result = await fetch(url);

  if (result.status === 200) {
    return await result.json();
  } else {
    return { errorStatus: result.status };
  }
};

export const debounce = (cb, interval) => {
  let lastTimeout = null;

  return (...parameters) => {
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    lastTimeout = window.setTimeout(() => {
      cb(...parameters);
    }, interval);
  };
};

export const getDeclension = (number, titles) => {
  const cases = [2, 0, 1, 1, 1, 2];
  return titles[
    number % 100 > 4 && number % 100 < 20 ? 2 : cases[number % 10 < 5 ? number % 10 : 5]
  ];
};

export const formatedPrice = (price) => new Intl.NumberFormat(`ru-RU`).format(price);

// Render

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const renderElements = (parent, elements, getTemplate) => {
  elements.forEach((card) => {
    const template = getTemplate(card);
    const element = createElement(template);
    parent.append(element);
  });
};

export const renderElement = (parent, template) => {
  const element = createElement(template);
  parent.append(element);
};

export const fadeIn = (element, timeout, display) => {
  element.style.opacity = 0;
  element.style.display = display || "block";
  element.style.transition = `opacity ${timeout}ms`;
  setTimeout(() => {
    element.style.opacity = 1;
  }, 10);
};

export const fadeOut = (element, timeout) => {
  element.style.opacity = 1;
  element.style.transition = `opacity ${timeout}ms`;
  element.style.opacity = 0;

  setTimeout(() => {
    element.style.display = "none";
  }, timeout);
};

// Показываем модальное окно
export const openModal = (modal, display) => {
  fadeIn(modal, 200, display);
};

// Скрываем модальное окно
export const closeModal = (modal) => {
  fadeOut(modal, 200);
};