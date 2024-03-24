import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Auth} from "../services/auth.js";

export class Result {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        // const that = this;

        // document.getElementById('result-answers').onclick = function (e) {
        //     e.preventDefault();
        //     location.href = '#/right-answers?name=' + that.routeParams.name +
        //         '&lastName=' + that.routeParams.lastName + '&email=' + that.routeParams.email + '&id='
        //         + that.routeParams.id + '&result=' + that.routeParams.result;
        //
        // }
        this.init();
    }

    async init() {

        const userInfo = Auth.getUserInfo();
        if (!userInfo) {
            location.href = '#/';
        }

        this.showRightAnswers();
        document.getElementById('result-answers').onclick = (e) => {
            this.goSeeAnswers(e);
            //в таком стрелочном виде, чтобы контекст сохранился
        }

    }

    async showRightAnswers(){
        if (this.routeParams.id) {
            try {
                const userInfo = Auth.getUserInfo();
                // либо сделать через this сверху, чтобы один раз получить
                const result = await CustomHttp.request(config.host + '/tests/' + this.routeParams.id + '/result?userId=' + userInfo.userId)
                if (result) {
                    if (result.error) {
                        throw  new Error(result.error);
                    }
                    document.getElementById('result-score').innerText = result.score + '/' + result.total;
                }
            } catch (error) {
                console.log(error);
                location.href = '#/';

            }
        }

    }

    goSeeAnswers(e){
        e.preventDefault();
        if (this.routeParams.id) {
        location.href = '#/right-answers?id=' + this.routeParams.id;

    }
    }





}




//надо сделать клик и ссылку