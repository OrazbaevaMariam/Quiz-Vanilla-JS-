import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class ShowAnswers {
    constructor() {
        this.rightAnswers = [];
        this.quiz = null;
        this.questionTitleElement = null;
        this.result = null;
        this.test = null;
        this.allQuestions = null;
        this.allAnswers = null;

        this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    init() {
        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }

        this.getQuestionsAnswers();
        document.getElementById('back-answers').onclick = (e) => {
            this.seeResult(e);
            //в таком стрелочном виде, чтобы контекст сохранился
        }
        // document.getElementById('back-answers').onclick = this.getQuestionsAnswers;

        // document.getElementById('back-answers').onclick = this.getQuestionsAnswers;

    }

    createCustomElements(tag, className, innerHTML = '', attributes = []) {
        const element = document.createElement(tag);
        element.className = className;
        element.innerHTML = innerHTML;
        attributes.forEach(attribute => {
            element.setAttribute(attribute.name, attribute.value)
        })

        return element;
    }


    async getQuestionsAnswers() {
        const userInfo = Auth.getUserInfo();
        if (this.routeParams.id) {
            document.getElementById('doneBy').innerHTML = 'Тест выполнил(а) ' + '<span>' + userInfo.fullName + ', ' + userInfo.email + '</span>';
            try {
                const userInfo = Auth.getUserInfo();
                this.result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result/details?userId=' + userInfo.userId);
                // выгружается объект с тестом - вопросы и ответы
                if (this.result) {
                    if (this.result.error) {
                        throw  new Error(this.result.error);
                    }

                }
            } catch (error) {
                console.log(error);
                location.href = '#/';
            }
            this.showQuestions();
        }


    }

    showQuestions() {

        const resultForm = document.getElementById('result__form');
        resultForm.innerHTML = '';
        this.test = this.result.test;

        this.allQuestions = this.test.questions;
        this.allQuestions.forEach((question, index) => {
                const divWrapElement = this.createCustomElements('div', 'result__question');
                const titleElement = this.createCustomElements('div', 'result__title');
                const spanElement = this.createCustomElements('span', '', 'Вопрос ' + (index + 1));
                titleElement.append(spanElement);
                titleElement.append(' ' + question.question);
                divWrapElement.append(titleElement);
                resultForm.append(divWrapElement);
                this.showAnswers(question, divWrapElement);
            }
        )

    }


//
    showAnswers(question, divWrapElement) {
        console.log(question)
        this.allAnswers = this.allQuestions.answers;

        question.answers.forEach(answer => {
            console.log(answer);

            const divElement = this.createCustomElements('div', 'result-choice');
            const inputElement = this.createCustomElements('input', 'radio', '',
                [{name: 'type', value: 'radio'}, {name: 'name', value: 'question-' + (question.id)}, {
                    name: 'id',
                    value: answer.id
                }, {name: 'disabled', value: 'disabled'},
                    {name: 'value', value: answer.id}]);
            const labelElement = this.createCustomElements('label', 'result-choice-text');

            labelElement.setAttribute('for', answer.id);
            labelElement.innerText = answer.answer;
            if (answer.id && answer.correct === true) {
                inputElement.classList.add('selected-right');
                labelElement.classList.add('selected-right-text')
                inputElement.setAttribute('checked', 'checked')
            }
            if (answer.id && answer.correct === false) {
                inputElement.classList.add('selected-wrong');
                labelElement.classList.add('selected-wrong-text');
                inputElement.setAttribute('checked', 'checked')


            }
            divElement.append(inputElement);
            divElement.append(labelElement);
            divWrapElement.append(divElement)

        })
    }

    seeResult(e) {
        e.preventDefault();
        if (this.routeParams.id) {
            location.href = '#/result?id=' + this.routeParams.id;
        }
    }
}

