import * as orderFixture from '../fixtures/order.json';

describe('E2E тестирование конструктора бургеров', () => {
  beforeEach(() => {
    // Устанавливаем фейковые токены авторизации
    cy.setCookie('accessToken', 'fakeAccessToken');
    localStorage.setItem('refreshToken', 'fakeRefreshToken');

    // Перехват запроса на получение ингредиентов
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
  });

  afterEach(() => {
    // Очистка токенов
    cy.clearCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });

  describe('Проверка наличия ингредиентов', () => {
    it('Ингредиенты загружены и доступны для выбора', () => {
      cy.wait('@getIngredients');
      cy.get('[data-cy="ingredient-bun"]').should('have.length.at.least', 1);
      cy.get('[data-cy="ingredient-main"]').should('have.length.at.least', 1);
      cy.get('[data-cy="ingredient-sauce"]').should('have.length.at.least', 1);
    });
  });

  describe('Проверка конструктора бургеров', () => {
    it('Добавление ингредиентов в конструктор', () => {
      // Проверяем, что конструктор пуст
      cy.get('[data-cy="burger-connstructor-section"]')
        .find('.constructor-element__text')
        .should('have.length', 0);

      // Добавляем булку
      cy.get('[data-cy="ingredient-bun"]').first().as('bun');
      cy.get('@bun').find('button').contains('Добавить').click();
      cy.get('[data-cy="burger-connstructor-section"]').within(() => {
        cy.get('.constructor-element__text')
          .contains('Краторная булка N-200i (верх)')
          .should('exist');
        cy.get('.constructor-element__text')
          .contains('Краторная булка N-200i (низ)')
          .should('exist');
      });
      cy.get('[data-cy="burger-constructor-button"]').should('be.disabled');

      // Добавляем начинку
      cy.get('[data-cy="ingredient-main"]').first().as('main');
      cy.get('@main').find('button').contains('Добавить').click();
      cy.get('[data-cy="burger-connstructor-section"]').within(() => {
        cy.get('.constructor-element__text')
          .contains('Биокотлета из марсианской Магнолии')
          .should('exist');
      });
      cy.get('[data-cy="burger-constructor-button"]').should('be.enabled');

      // Добавляем соус
      cy.get('[data-cy="ingredient-sauce"]').first().as('sauce');
      cy.get('@sauce').find('button').contains('Добавить').click();
      cy.get('[data-cy="burger-connstructor-section"]').within(() => {
        cy.get('.constructor-element__text')
          .contains('Соус с шипами Антарианского плоскоходца')
          .should('exist');
      });
      cy.get('[data-cy="burger-constructor-button"]').should('be.enabled');
    });
  });

  describe('Проверка работы модальных окон', () => {
    describe('Проверка открытия', () => {
      it('Открытие модального окна ингредиента', () => {
        cy.get('[data-cy="ingredient-bun"]').first().click();
        cy.get('[data-cy="modal-data"]').should('exist').and('be.visible');
      });

      it('Модальное окно открыто после перезагрузки страницы', () => {
        cy.get('[data-cy="ingredient-bun"]').first().click();
        cy.reload(true);
        cy.get('[data-cy="modal-data"]').should('exist').and('be.visible');
      });
    });

    describe('Проверка закрытия', () => {
      it('По клику на крестик', () => {
        cy.get('[data-cy="ingredient-bun"]').first().click();
        cy.get('[data-cy="modal-data"]').should('exist').and('be.visible');
        cy.get('[data-cy="modal-data"]').find('button').first().click();
        cy.get('[data-cy="modal-data"]').should('not.exist');
      });

      it('По клику на оверлей', () => {
        cy.get('[data-cy="ingredient-bun"]').first().click();
        cy.get('[data-cy="modal-data"]').should('exist').and('be.visible');
        cy.get('[data-cy="modal-data"]').next().should('exist');
        cy.get('[data-cy="modal-data"]').next().click({ force: true });
        cy.get('[data-cy="modal-data"]').should('not.exist');
      });

      it('По клику на Escape', () => {
        cy.get('[data-cy="ingredient-bun"]').first().click();
        cy.get('[data-cy="modal-data"]').should('exist').and('be.visible');
        cy.get('body').type('{esc}');
        cy.get('[data-cy="modal-data"]').should('not.exist');
      });
    });
  });

  describe('Проверка создания заказа', () => {
    it('Создание заказа', () => {
      // Добавляем ингредиенты
      cy.get('[data-cy="ingredient-bun"]')
        .first()
        .find('button')
        .contains('Добавить')
        .click();
      cy.get('[data-cy="ingredient-main"]')
        .first()
        .find('button')
        .contains('Добавить')
        .click();
      cy.get('[data-cy="burger-constructor-button"]').should('be.enabled');

      // Кликаем по кнопке "Оформить заказ"
      cy.get('[data-cy="burger-constructor-button"]').click();

      // Проверяем модальное окно с номером заказа
      cy.get('[data-cy="modal-data"]').should('be.visible');
      cy.get('[data-cy="modal-data"] h2')
        .first()
        .should('have.text', orderFixture.order.number);

      // Закрываем модальное окно
      cy.get('[data-cy="modal-data"]').find('button').first().click();
      cy.get('[data-cy="modal-data"]').should('not.exist');

      // Проверяем, что конструктор пуст
      cy.get('[data-cy="burger-connstructor-section"]')
        .find('.constructor-element__text')
        .should('have.length', 0);
    });
  });
});
