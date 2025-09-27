import { selectors } from '../support/selectors';

describe('E2E тестирование конструктора бургеров', () => {
  beforeEach(() => {
    // Устанавливаем фейковые токены авторизации
    cy.setCookie('accessToken', 'fakeAccessToken');
    localStorage.setItem('refreshToken', 'fakeRefreshToken');

    // Перехват запросов
    cy.intercept('GET', `${Cypress.env('BURGER_API_URL')}/ingredients`, {
      fixture: 'ingredients'
    }).as('getIngredients');

    cy.intercept('GET', `${Cypress.env('BURGER_API_URL')}/auth/user`, {
      fixture: 'user'
    }).as('getUser');

    cy.intercept('POST', `${Cypress.env('BURGER_API_URL')}/orders`, {
      fixture: 'order'
    }).as('createOrder');

    cy.visit('/');
    cy.wait(['@getIngredients', '@getUser']);
  });

  afterEach(() => {
    // Очистка токенов
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  describe('Проверка наличия ингредиентов', () => {
    it('Ингредиенты загружены и доступны для выбора', () => {
      cy.get(selectors.ingredientBun).should('have.length.at.least', 1);
      cy.get(selectors.ingredientMain).should('have.length.at.least', 1);
      cy.get(selectors.ingredientSauce).should('have.length.at.least', 1);
    });
  });

  describe('Проверка конструктора бургеров', () => {
    it('Добавление ингредиентов в конструктор', () => {
      // Проверяем, что конструктор пуст
      cy.get(selectors.burgerConstructorSection)
        .find('.constructor-element__text')
        .should('have.length', 0);

      // Добавляем булку
      cy.addIngredient('bun');
      cy.get(selectors.burgerConstructorSection).within(() => {
        cy.get('.constructor-element__text')
          .contains('Краторная булка N-200i (верх)')
          .should('exist');
        cy.get('.constructor-element__text')
          .contains('Краторная булка N-200i (низ)')
          .should('exist');
      });
      cy.get(selectors.burgerConstructorButton).should('be.disabled');

      // Добавляем начинку
      cy.addIngredient('main');
      cy.get(selectors.burgerConstructorSection).within(() => {
        cy.get('.constructor-element__text')
          .contains('Биокотлета из марсианской Магнолии')
          .should('exist');
      });
      cy.get(selectors.burgerConstructorButton).should('be.enabled');

      // Добавляем соус
      cy.addIngredient('sauce');
      cy.get(selectors.burgerConstructorSection).within(() => {
        cy.get('.constructor-element__text')
          .contains('Соус с шипами Антарианского плоскоходца')
          .should('exist');
      });
      cy.get(selectors.burgerConstructorButton).should('be.enabled');
    });
  });

  describe('Проверка работы модальных окон', () => {
    describe('Проверка открытия', () => {
      it('Открытие модального окна ингредиента', () => {
        cy.openIngredientModal();
      });

      it('Модальное окно открыто после перезагрузки страницы', () => {
        cy.openIngredientModal();
        cy.reload(true);
        cy.get(selectors.modalData).should('be.visible');
      });
    });

    describe('Проверка закрытия', () => {
      it('По клику на крестик', () => {
        cy.openIngredientModal();
        cy.closeModal('button');
      });

      it('По клику на оверлей', () => {
        cy.openIngredientModal();
        cy.closeModal('overlay');
      });

      it('По клику на Escape', () => {
        cy.openIngredientModal();
        cy.closeModal('escape');
      });
    });
  });

  describe('Проверка создания заказа', () => {
    it('Создание заказа', () => {
      // Добавляем ингредиенты
      cy.addIngredient('bun');
      cy.addIngredient('main');
      cy.get(selectors.burgerConstructorButton).should('be.enabled');

      // Создаём заказ
      cy.createOrder();

      // Проверяем, что конструктор пуст
      cy.get(selectors.burgerConstructorSection)
        .find('.constructor-element__text')
        .should('have.length', 0);
    });
  });
});
