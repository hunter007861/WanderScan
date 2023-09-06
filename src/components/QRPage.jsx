import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import React, { useEffect, useState } from 'react';
import ProductService from '../service/ProductService';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import QRCode from 'react-qr-code';
import download from 'downloadjs';
import * as htmlToImage from 'html-to-image';

const QRPage = () => {
    const [products, setProducts] = useState([]);
    const productService = new ProductService();
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
                    console.log(artifact);
                    setVisible(false);
                }}
                autoFocus
            />
        </div>
    );

    useEffect(() => {
        productService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    };

    const imageBodyTemplate = (product) => {
        return <QRCode id={product.id} size={80} value={product.name} viewBox={`0 0 80 80`} />;
    };

    const priceBodyTemplate = (product) => {
        return formatCurrency(product.price);
    };

    const ratingBodyTemplate = (product) => {
        return <Rating value={product.rating} readOnly cancel={false} />;
    };

    const ActionBodyTemplate = (product) => {
        const downloadQR = async (qrValue) => {
            const qrCodeImage = await htmlToImage.toPng(
                document.getElementById(`${product.id}`)
            );

            // Trigger the download ohtmlToImagef the QR code as a PNG file
            download(qrCodeImage, `${product.name}_qr_code.png`, 'image/png');
        };
        return (
            <div>
                <Button icon="pi pi-download" className="mr-2 mb-2" onClick={downloadQR} />
            </div>
        );
    };

    const getSeverity = (product) => {
        switch (product.inventoryStatus) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
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
            <DataTable value={products} header={header} footer={footer}>
                <Column field="name" header="Name"></Column>
                <Column header="QR Code" body={imageBodyTemplate}></Column>
                <Column field="price" header="Type" body={priceBodyTemplate}></Column>
                <Column field="category" header="Location"></Column>
                <Column field="rating" header="Description" body={ratingBodyTemplate}></Column>
                <Column field="rating" header="Actions" body={ActionBodyTemplate}></Column>
            </DataTable>
        </div>
    );
};

export default QRPage;
