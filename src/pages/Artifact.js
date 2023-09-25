import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import logo from '../assets/logo-white.svg';
import { Dropdown } from 'primereact/dropdown';
import { Axios } from '../AxiosConfig';
import axios from 'axios';
import { Button } from 'primereact/button';

const Artifact = () => {
    const dropdownValues = [
        { name: 'Afrikaans', code: 'af' },
        { name: 'Albanian', code: 'sq' },
        { name: 'Arabic', code: 'ar' },
        { name: 'Bengali', code: 'bn' },
        { name: 'Bulgarian', code: 'bg' },
        { name: 'Burmese', code: 'my' },
        { name: 'Catalan', code: 'ca' },
        { name: 'Chinese (Mandarin)', code: 'zh' },
        { name: 'Croatian', code: 'hr' },
        { name: 'Czech', code: 'cs' },
        { name: 'Danish', code: 'da' },
        { name: 'Dutch', code: 'nl' },
        { name: 'English', code: 'en' },
        { name: 'Esperanto', code: 'eo' },
        { name: 'Estonian', code: 'et' },
        { name: 'Filipino', code: 'tl' },
        { name: 'Finnish', code: 'fi' },
        { name: 'French', code: 'fr' },
        { name: 'German', code: 'de' },
        { name: 'Greek', code: 'el' },
        { name: 'Gujarati', code: 'gu' },
        { name: 'Haitian Creole', code: 'ht' },
        { name: 'Hebrew', code: 'iw' },
        { name: 'Hindi', code: 'hi' },
        { name: 'Hungarian', code: 'hu' },
        { name: 'Icelandic', code: 'is' },
        { name: 'Indonesian', code: 'id' },
        { name: 'Italian', code: 'it' },
        { name: 'Japanese', code: 'ja' },
        { name: 'Javanese', code: 'jw' },
        { name: 'Kannada', code: 'kn' },
        { name: 'Khmer', code: 'km' },
        { name: 'Korean', code: 'ko' },
        { name: 'Lao', code: 'lo' },
        { name: 'Latin', code: 'la' },
        { name: 'Latvian', code: 'lv' },
        { name: 'Lithuanian', code: 'lt' },
        { name: 'Macedonian', code: 'mk' },
        { name: 'Malayalam', code: 'ml' },
        { name: 'Maltese', code: 'mt' },
        { name: 'Marathi', code: 'mr' },
        { name: 'Nepali', code: 'ne' },
        { name: 'Norwegian', code: 'no' },
        { name: 'Oriya', code: 'or' },
        { name: 'Pashto', code: 'ps' },
        { name: 'Persian', code: 'fa' },
        { name: 'Polish', code: 'pl' },
        { name: 'Portuguese', code: 'pt' },
        { name: 'Punjabi', code: 'pa' },
        { name: 'Romanian', code: 'ro' },
        { name: 'Russian', code: 'ru' },
        { name: 'Serbian', code: 'sr' },
        { name: 'Slovak', code: 'sk' },
        { name: 'Slovenian', code: 'sl' },
        { name: 'Somali', code: 'so' },
        { name: 'Spanish', code: 'es' },
        { name: 'Sundanese', code: 'su' },
        { name: 'Swahili', code: 'sw' },
        { name: 'Swedish', code: 'sv' },
        { name: 'Tagalog', code: 'tl' },
        { name: 'Tamil', code: 'ta' },
        { name: 'Telugu', code: 'te' },
        { name: 'Thai', code: 'th' },
        { name: 'Turkish', code: 'tr' },
        { name: 'Ukrainian', code: 'uk' },
        { name: 'Urdu', code: 'ur' },
        { name: 'Uzbek', code: 'uz' },
        { name: 'Vietnamese', code: 'vi' },
        { name: 'Welsh', code: 'cy' },
        { name: 'Yiddish', code: 'yi' },
        { name: 'Yoruba', code: 'yo' }
    ];

    const [artifactData, setArtifactData] = useState({});
    const [to, setTo] = useState({ code: 'en' });
    const [artifactTrans, setArtifactTrans] = useState({});
    const [isPlaying, setIsPlaying] = useState(false);
    const [loadAudio, setLoadAudio] = useState(false);
    let audioRef = useRef();
    let { id } = useParams();

    useEffect(() => {
        const getArtifact = async () => {
            await Axios.get(`/user/getartifact/${id}`).then((resp) => {
                setArtifactData(resp.data);
                setArtifactTrans(resp.data);
                getAudio({ ...resp.data, lang: 'en' });
            });
        };
        getArtifact();
        // eslint-disable-next-line
    }, []);

    const getAudio = async (props) => {
        setLoadAudio(true);
        const options = {
            method: 'GET',
            url: 'https://text-to-speech-api3.p.rapidapi.com/speak',
            params: {
                text: `${props.artifactName} ${props.description}`,
                lang: props.lang
            },
            responseType: 'arraybuffer', // Set responseType to 'arraybuffer' to receive binary data
            headers: {
                'X-RapidAPI-Key': '77eb35012emsh9145aad7ada67fep19ba5djsn41f6e08a3e5f',
                'X-RapidAPI-Host': 'text-to-speech-api3.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
            const audioDataUri = URL.createObjectURL(audioBlob);

            // Set the audio source
            audioRef.current.src = await audioDataUri;
            setLoadAudio(false);
        } catch (error) {
            console.error(error);
        }
    };

    const onTranslate = async (e) => {
        setTo(e.value);
        console.log(e.value.code);
        // const options = {
        //     method: 'POST',
        //     url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        //     params: {
        //         'to[0]': e.value.code,
        //         'api-version': '3.0',
        //         from: 'en',
        //         profanityAction: 'NoAction',
        //         textType: 'plain'
        //     },
        //     headers: {
        //         'content-type': 'application/json',
        //         'X-RapidAPI-Key': '77eb35012emsh9145aad7ada67fep19ba5djsn41f6e08a3e5f',
        //         'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        //     },
        //     data: [
        //         {
        //             Text: artifactData.artifactName
        //         }
        //     ]
        // };

        // const options2 = {
        //     method: 'POST',
        //     url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        //     params: {
        //         'to[0]': e.value.code,
        //         'api-version': '3.0',
        //         from: 'en',
        //         profanityAction: 'NoAction',
        //         textType: 'plain'
        //     },
        //     headers: {
        //         'content-type': 'application/json',
        //         'X-RapidAPI-Key': '77eb35012emsh9145aad7ada67fep19ba5djsn41f6e08a3e5f',
        //         'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        //     },
        //     data: [
        //         {
        //             Text: artifactData.description
        //         }
        //     ]
        // };
        try {
            // const title = await axios.request(options);
            // const desc = await axios.request(options2);
            // setArtifactTrans({ ...artifactData, artifactName: title.data[0].translations[0].text, description: desc.data[0].translations[0].text });

            const title = await axios.post(
                'https://rapid-translate-multi-traduction.p.rapidapi.com/t',
                {
                    from: 'en',
                    to: e.value.code,
                    q: artifactData.artifactName
                },
                {
                    headers: {
                        'content-type': 'application/json',
                        'X-RapidAPI-Key': '77eb35012emsh9145aad7ada67fep19ba5djsn41f6e08a3e5f',
                        'X-RapidAPI-Host': 'rapid-translate-multi-traduction.p.rapidapi.com'
                    }
                }
            );
            const desc = await axios.post(
                'https://rapid-translate-multi-traduction.p.rapidapi.com/t',
                {
                    from: 'en',
                    to: e.value.code,
                    q: artifactData.description
                },
                {
                    headers: {
                        'content-type': 'application/json',
                        'X-RapidAPI-Key': '77eb35012emsh9145aad7ada67fep19ba5djsn41f6e08a3e5f',
                        'X-RapidAPI-Host': 'rapid-translate-multi-traduction.p.rapidapi.com'
                    }
                }
            );
            setArtifactTrans({ ...artifactData, artifactName: title.data[0], description: desc.data[0] });
            getAudio({ artifactName: title.data[0], description: desc.data[0], lang: e.value.code });
        } catch (error) {
            console.error(error);
        }
    };

    const onSpeak = async () => {
        if (isPlaying) {
            setIsPlaying(false);
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        } else {
            setIsPlaying(true);
            audioRef.current.play();
        }
    };

    const onAudioEnded = async () => {
        setIsPlaying(false);
    };

    return (
        <div className="exception-body access">
            <div className="d-flex">
                <img src={logo} alt="diamond-layout" className="logo" />
                <Dropdown
                    className="lang"
                    value={to}
                    options={dropdownValues}
                    optionLabel="name"
                    onChange={(e) => onTranslate(e)}
                    placeholder="language"
                    style={{
                        width: '150px',
                        position: 'absolute',
                        right: '50px',
                        top: '50px'
                    }}
                />
            </div>

            <div className="exception-content">
                <div
                    className="artifactTitle"
                    style={{
                        fontSize: '30px',
                        fontWeight: 'bold',
                        color: 'white',
                        textTransform: 'uppercase'
                    }}
                >
                    {artifactTrans.artifactName}
                </div>
                <div className="exception-detail">{artifactTrans.description}</div>
                <audio ref={audioRef} onEnded={onAudioEnded} />
                <Button
                    icon={isPlaying ? 'pi pi-stop' : 'pi pi-megaphone'}
                    style={{ color: 'white', height:"50px", width:"50px"}}
                    disabled={loadAudio}
                    size="large" 
                    className={loadAudio ? `p-button-rounded pi-spin p-button-outlined mr-2 my-3` : `p-button-rounded p-button-outlined mr-2 my-3`}
                    onClick={() => {
                        onSpeak();
                    }}
                />
            </div>
        </div>
    );
};

export default Artifact;
