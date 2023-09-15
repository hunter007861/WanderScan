import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import logo from '../assets/logo-white.svg';
import { Dropdown } from 'primereact/dropdown';
import { Axios } from '../AxiosConfig';
import axios from 'axios';
import { Button } from 'primereact/button';

const Artifact = () => {
    const [dropdownValues, setDropdownValues] = useState([]);
    const [artifactData, setArtifactData] = useState({});
    const [to, setTo] = useState('');
    const [artifactTrans, setArtifactTrans] = useState({});
    let { id } = useParams();

    useEffect(() => {
        const getArtifact = async () => {
            await Axios.get(`/user/getartifact/${id}`).then((resp) => {
                setArtifactData(resp.data);
                setArtifactTrans(resp.data);
                console.log(resp.data);
            });
        };

        const getDropDownValues = async () => {
            await axios.get('https://libretranslate.com/languages').then((res) => {
                setDropdownValues(res.data);
                setTo(res.data[0]);
            });
        };
        getArtifact();
        getDropDownValues();
        // eslint-disable-next-line
    }, []);

    const onTranslate = async (e) => {
        setTo(e.value);
        console.log(e.value.code);
        const options = {
            method: 'POST',
            url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
            params: {
                'to[0]': e.value.code,
                'api-version': '3.0',
                from: 'en',
                profanityAction: 'NoAction',
                textType: 'plain'
            },
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '77eb35012emsh9145aad7ada67fep19ba5djsn41f6e08a3e5f',
                'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
            },
            data: [
                {
                    Text: artifactData.artifactName
                }
            ]
        };

        const options2 = {
            method: 'POST',
            url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
            params: {
                'to[0]': e.value.code,
                'api-version': '3.0',
                from: 'en',
                profanityAction: 'NoAction',
                textType: 'plain'
            },
            headers: {
                'content-type': 'application/json',
                'X-RapidAPI-Key': '77eb35012emsh9145aad7ada67fep19ba5djsn41f6e08a3e5f',
                'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
            },
            data: [
                {
                    Text: artifactData.description
                }
            ]
        };
        try {
            const title = await axios.request(options);
            const desc = await axios.request(options2);
            setArtifactTrans({ ...artifactData, artifactName: title.data[0].translations[0].text, description: desc.data[0].translations[0].text });

            // const title = await axios.post(
            //     'https://rapid-translate-multi-traduction.p.rapidapi.com/t',
            //     {
            //         from: 'en',
            //         to: e.value.code,
            //         q: artifactData.artifactName
            //     },
            //     {
            //         headers: {
            //             'content-type': 'application/json',
            //             'X-RapidAPI-Key': '77eb35012emsh9145aad7ada67fep19ba5djsn41f6e08a3e5f',
            //             'X-RapidAPI-Host': 'rapid-translate-multi-traduction.p.rapidapi.com'
            //         }
            //     }
            // );
            // const desc = await axios.post(
            //     'https://rapid-translate-multi-traduction.p.rapidapi.com/t',
            //     {
            //         from: 'en',
            //         to: e.value.code,
            //         q: artifactData.description
            //     },
            //     {
            //         headers: {
            //             'content-type': 'application/json',
            //             'X-RapidAPI-Key': '77eb35012emsh9145aad7ada67fep19ba5djsn41f6e08a3e5f',
            //             'X-RapidAPI-Host': 'rapid-translate-multi-traduction.p.rapidapi.com'
            //         }
            //     }
            // );
            // setArtifactTrans({ ...artifactData, artifactName: title.data[0], description: desc.data[0] });
        } catch (error) {
            console.error(error);
        }
    };

    const onSpeak = async () => {
        const options = {
            method: 'GET',
            url: 'https://text-to-speech-api3.p.rapidapi.com/speak',
            params: {
                text: `${artifactTrans.artifactName} ${artifactTrans.description}`,
                lang: to.code
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

            // Create an audio element
            const audio = new Audio(audioDataUri);

            // Play the audio
            audio.play();
        } catch (error) {
            console.error(error);
        }
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
                <Button
                    icon="pi pi-megaphone"
                    style={{ color: 'white' }}
                    className="p-button-rounded p-button-outlined mr-2 mb-2"
                    onClick={() => {
                        onSpeak();
                    }}
                />
            </div>
        </div>
    );
};

export default Artifact;
