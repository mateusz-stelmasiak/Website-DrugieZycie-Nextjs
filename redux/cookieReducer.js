import * as actions from './cookieActions'


export class Cookie {
    constructor(name, link, purpose, party, expiration) {
        this.name = name;
        this.link = link;
        this.purpose = purpose;
        this.party = party;
        this.expiration = expiration;
    }

}

export let cookies =
    {
        podstawowe:
            {
                desc: 'Wymagane do obsługi podstawowych funkcji witryny.',
                consent_string:'default',
                list: [
                    new Cookie(
                        'rc::a',
                        'https://cookiedatabase.org/cookie/google-recaptcha/rca/',
                        'Google reCaptcha- rozpoznawanie między użytkownikami a botami.',
                        'Third party',
                        'Stałe'
                    ),
                    new Cookie(
                        'rc::c',
                        'https://cookiedatabase.org/cookie/google-recaptcha/rcc/',
                        'Google reCaptcha- rozpoznawanie między użytkownikami a botami.',
                        'Third party',
                        'Sesja'
                    ),
                    new Cookie(
                        'cookies_consent',
                        null,
                        'Zapamiętuje wybrane przez użytkownika ustawienia plików cookie.',
                        'First party',
                        '30 dni'
                    )
                ]
            }
        ,
        analizy:
            {
                desc: 'Pomagają operatorowi witryny internetowej zrozumieć, jak działa jego witryna, ' +
                    'jak odwiedzający wchodzą w interakcję z witryną i czy mogą wystąpić problemy techniczne.' +
                    ' W ramach tego typu przechowywania zazwyczaj nie zbiera się informacji identyfikujących gościa.',
                consent_string:'analisis',
                list: [
                    new Cookie(
                        '_fbp, _fbc',
                        'https://cookiedatabase.org/cookie/facebook/_fbp/',
                        'Facebook pixel- śledzenie zachowań użytkowników na stronie w celu określenia wydajności reklam.',
                        'Third party',
                        '3 miesiące'
                    ),
                    new Cookie(
                        'tr',
                        null,
                        'Facebook pixel- śledzenie zachowań użytkowników na stronie w celu określenia wydajności reklam.',
                        'Third party',
                        'Sesja'
                    )
                ]
            }
    };

export let cookieTypes=Object.keys(cookies);

// Set a Cookie
export function setCookie(cName, cValue, expDays) {
    if(typeof window === "undefined") return;

    let date = new Date();
    date.setTime(date.getTime() + (expDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    window.document.cookie = cName + "=" + cValue + "; " + expires + "; path=/";
}

export function getCookie(cName) {
    if(typeof window === "undefined") return;

    const name = cName + "=";
    const cDecoded = decodeURIComponent(window.document.cookie); //to be careful??
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
        if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res;
}

export const cookiesInitialState = {
    consented: getCookie('cookie_consent') ? getCookie('cookie_consent').split(','):['podstawowe'],
    prefOpen:false
}

export default function cookieReducer(state = cookiesInitialState, action) {
    switch (action.type) {
        case actions.ACCEPT_ALL_COOKIES:
            return {...state, consented: cookieTypes};
        case actions.TOOGLE_CONSENT:
            let consentedLocal=state.consented;
            let index = consentedLocal.indexOf(action.payload);
            index !== -1 ? consentedLocal.splice(index, 1) : consentedLocal.push(action.payload);
            return {...state, consented: consentedLocal};
        case actions.UPDATE_BEHAVIOUR:
            let localCons=state.consented;
            // let turnOnAnalysis = localCons.includes('analizy');
            // turnOnAnalysis ? ReactPixel.grantConsent() : ReactPixel.revokeConsent();
            let consentString=localCons.join(',');
            setCookie('cookie_consent', consentString, 30);
            return state
        case actions.SET_PREFERENCES_OPEN:
            return {...state, prefOpen: action.payload};
        default:
            return state
    }
}
