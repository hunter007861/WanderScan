import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Rating } from 'primereact/rating';
import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import QRCode from 'react-qr-code';
import download from 'downloadjs';
import * as htmlToImage from 'html-to-image';
import { Axios } from '../AxiosConfig';

const QRPage = () => {
    const [products, setProducts] = useState([]);
    const [visible, setVisible] = useState(false);
    const [artifact, setArtifact] = useState({
        artifactName: '',
        artifactType: '',
        description: '',
        location: ''
    });

    const footerContent = (
        <div>
            <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button
                label="Yes"
                icon="pi pi-check"
                onClick={() => {
                    Axios.post('/user/createArtifact', artifact).then((res) => {
                        setProducts([...products, res.data]);
                        setVisible(false);
                    });
                }}
                autoFocus
            />
        </div>
    );

    useEffect(() => {
        const getData = async () => {
            await Axios.get('/user/getAllArtifact').then((resp) => {
                setProducts(resp.data);
            });
        };
        getData();
    }, []);

    const imageBodyTemplate = (product) => {
        return <QRCode id={product._id} size={80} value={`http://192.168.0.115:3000/artifact/${product._id}`} viewBox={`0 0 80 80`} />;
    };

    const ActionBodyTemplate = (product) => {
        const downloadQR = async () => {
            const qrCodeImage = await htmlToImage.toPng(document.getElementById(`${product._id}`));

            // Trigger the download ohtmlToImagef the QR code as a PNG file
            download(qrCodeImage, `${product.name}_qr_code.png`, 'image/png');
        };
        return (
            <div className='flex'>
                <Button icon="pi pi-pencil"  className="mr-2 mb-2 p-button-success" onClick={downloadQR} />

                <Button icon="pi pi-trash" className="mr-2 mb-2 p-button-danger"  onClick={downloadQR} />

                <Button icon="pi pi-download" className="mr-2 mb-2" onClick={downloadQR} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-wrap align-items-center justify-content-between gap-2">
            <span className="text-xl text-900 font-bold">Artifacts List</span>
            <Button label="Add Artifact" icon="pi pi-plus" iconPos="right" className="mr-2 mb-2" onClick={() => setVisible(true)} />
        </div>
    );
    const footer = `In total there are ${products ? products.length : 0} products.`;

    return (
        <div>
            <Dialog header="Add Artifact" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} footer={footerContent} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <div className="col-12">
                    <div className="card">
                        <div className="p-fluid formgrid grid">
                            <div className="field col-12 md:col-6">
                                <label htmlFor="artifactName">Artifact Name</label>
                                <InputText
                                    id="artifactName"
                                    type="text"
                                    onChange={(e) => {
                                        setArtifact({ ...artifact, artifactName: e.target.value });
                                    }}
                                />
                            </div>
                            <div className="field col-12 md:col-6">
                                <label htmlFor="artifactType">Type</label>
                                <InputText
                                    id="artifactType"
                                    type="text"
                                    onChange={(e) => {
                                        setArtifact({ ...artifact, artifactType: e.target.value });
                                    }}
                                />
                            </div>
                            <div className="field col-12">
                                <label htmlFor="location">Location</label>
                                <InputText
                                    id="location"
                                    type="text"
                                    onChange={(e) => {
                                        setArtifact({ ...artifact, location: e.target.value });
                                    }}
                                />
                            </div>
                            <div className="field col-12">
                                <label htmlFor="description">Description</label>
                                <InputTextarea
                                    id="description"
                                    rows="4"
                                    onChange={(e) => {
                                        setArtifact({ ...artifact, description: e.target.value });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </Dialog>
            {products && products?.length > 0 ? (
                <DataTable value={products} header={header} footer={footer}>
                    <Column field="artifactName" header="Name"></Column>
                    <Column header="QR Code" body={imageBodyTemplate}></Column>
                    <Column field="artifactType" header="Type"></Column>
                    <Column field="location" header="Location"></Column>
                    <Column field="description" header="Description"></Column>
                    <Column header="Actions" body={ActionBodyTemplate}></Column>
                </DataTable>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default QRPage;
