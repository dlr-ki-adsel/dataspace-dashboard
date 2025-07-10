import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import InfoDrawer from '../utils/InfoDrawer';
import { handleCreateConnector } from '../../services/createConnector';
import { getModalBoxStyle } from '../../styles/modalStyles';
import CreateButton from './CreateButton';
import connector_info from '../../assets/info_data/createConnector_info.json';

interface CreateConnectorModalProps {
    getAccessTokenSilently: () => Promise<string>;
}

const CreateConnectorButton: React.FC<CreateConnectorModalProps> = ({ getAccessTokenSilently }) => {
    const [open, setOpen] = useState(false);
    const [connectorName, setConnectorName] = useState('');
    const [storageType, setstorageType] = useState('');
    const [bucketName, setBucketName] = useState('');
    const [region, setRegion] = useState('');
    const [endpointOverride, setEndpointOverride] = useState('');
    const [accessKeyIdWrite, setAccessKeyIdWrite] = useState('');
    const [secretAccessKeyWrite, setSecretAccessKeyWrite] = useState('');
    const [accessKeyIdRead, setAccessKeyIdRead] = useState('');
    const [secretAccessKeyRead, setSecretAccessKeyRead] = useState('');
    const [azureAccountNameRead, setAzureAccountNameRead] = useState('');
    const [azureAccountKeyRead, setAzureAccountKeyRead] = useState('');
    const [azureAccountNameWrite, setAzureAccountNameWrite] = useState('');
    const [azureAccountKeyWrite, setAzureAccountKeyWrite] = useState('');
    const [azureContainerName, setAzureContainerName] = useState('');
    const [blobStoreEndpoint, setBlobStoreEndpoint] = useState('');
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [errors, setErrors] = useState<{ name?: boolean }>({});


    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setDrawerOpen(false);
        setErrors({});
    };

    const handleSubmit = () => {
        let newErrors: { name?: boolean } = {};

        if (!connectorName.trim()) {
            newErrors.name = true;
        }
    
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        setErrors({});
        const connectorData = {
            connectorName,
            storageType,
            ...(storageType === 'AmazonS3' && {
                bucketName,
                region,
                endpointOverride,
                accessKeyIdRead,
                secretAccessKeyRead,
                accessKeyIdWrite,
                secretAccessKeyWrite,
            }),
            ...(storageType === 'AzureStorage' && {
                azureContainerName,
                blobStoreEndpoint,
                azureAccountNameRead,
                azureAccountKeyRead,
                azureAccountNameWrite,
                azureAccountKeyWrite,
            }),
        };

        handleCreateConnector(getAccessTokenSilently, connectorData)
            .then(() => {
                setConnectorName('');
                setstorageType('');
                setBucketName('');
                setRegion('');
                setEndpointOverride('');
                setAccessKeyIdWrite('');
                setSecretAccessKeyWrite('');
                setAccessKeyIdRead('');
                setSecretAccessKeyRead('');
                setAzureAccountNameRead('');
                setAzureAccountKeyRead('');
                setAzureAccountNameWrite('');
                setAzureAccountKeyWrite('');
                setAzureContainerName('');
                setBlobStoreEndpoint('');
                handleClose();
            })
            .catch((error) => {
                console.error('Error creating connector:', error);
            });
    };

    return (
        <div>
            <CreateButton onClick={handleOpen} />
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                slotProps={{
                    backdrop: { sx: { backgroundColor: drawerOpen ? 'transparent' : 'rgba(0, 0, 0, 0.5)' } }
                }}
            >
                <Box sx={getModalBoxStyle(400)}>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Create a New Connector
                        </Typography>
                        <InfoDrawer
                            title={connector_info.title}
                            body={connector_info.body}
                            onOpen={() => setDrawerOpen(true)}
                            onClose={() => setDrawerOpen(false)}
                        />

                    </Box>


                    <TextField
                        id="connector-name"
                        label="Connector Name"
                        variant="outlined"
                        fullWidth
                        required
                        value={connectorName}
                        onChange={(e) => {
                            const inputValue = e.target.value.toLowerCase();
                            const regex = /^$|^[a-z0-9]([-a-z0-9]{0,14}[a-z0-9])?$/;

                            if (regex.test(inputValue)) {
                                setConnectorName(inputValue);
                            }
                        }}
                        sx={{ mt: 2 }}
                        error={errors.name ?? false}
                        helperText={errors.name ? 'Connector Name is required' : ''} 
                    />

                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="storage-type-label">Storage Type</InputLabel>
                        <Select
                            labelId="storage-type-label"
                            value={storageType}
                            onChange={(e) => setstorageType(e.target.value)}
                            label="Storage Type"
                        >
                            <MenuItem value="AmazonS3">AmazonS3</MenuItem>
                            <MenuItem value="AzureStorage">AzureStorage</MenuItem>
                            <MenuItem value="HttpData">HttpData</MenuItem>
                        </Select>
                    </FormControl>

                    {storageType === 'AmazonS3' && (
                        <>
                            <TextField
                                id="bucket-name"
                                label="Bucket Name"
                                variant="outlined"
                                fullWidth
                                value={bucketName}
                                onChange={(e) => setBucketName(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                id="region"
                                label="Region"
                                variant="outlined"
                                fullWidth
                                value={region}
                                onChange={(e) => setRegion(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                id="endpoint-override"
                                label="Endpoint Override"
                                variant="outlined"
                                fullWidth
                                value={endpointOverride}
                                onChange={(e) => setEndpointOverride(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                id="access-key-id-read"
                                label="Access Key ID Read"
                                variant="outlined"
                                fullWidth
                                value={accessKeyIdRead}
                                onChange={(e) => setAccessKeyIdRead(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                id="secret-access-key-read"
                                label="Secret Access Key Read"
                                variant="outlined"
                                fullWidth
                                type="password"
                                value={secretAccessKeyRead}
                                onChange={(e) => setSecretAccessKeyRead(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                id="access-key-id-write"
                                label="Access Key ID Write"
                                variant="outlined"
                                fullWidth
                                value={accessKeyIdWrite}
                                onChange={(e) => setAccessKeyIdWrite(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                id="secret-access-key-write"
                                label="Secret Access Key Write"
                                variant="outlined"
                                fullWidth
                                type="password"
                                value={secretAccessKeyWrite}
                                onChange={(e) => setSecretAccessKeyWrite(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                        </>
                    )}

                    {storageType === 'AzureStorage' && (
                        <>
                            <TextField
                                id="azure-container-name"
                                label="Azure Container name"
                                variant="outlined"
                                fullWidth
                                value={azureContainerName}
                                onChange={(e) => setAzureContainerName(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                id="blob-store-enpoint"
                                label="Blob Store Endpoint"
                                variant="outlined"
                                fullWidth
                                value={blobStoreEndpoint}
                                onChange={(e) => setBlobStoreEndpoint(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                id="azure-account-name-read"
                                label="Azure Account Name Read"
                                variant="outlined"
                                fullWidth
                                value={azureAccountNameRead}
                                onChange={(e) => setAzureAccountNameRead(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                id="azure-account-key-Read"
                                label="Azure Account Key-Read"
                                variant="outlined"
                                fullWidth
                                type="password"
                                value={azureAccountKeyRead}
                                onChange={(e) => setAzureAccountKeyRead(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                id="azure-account-name-Write"
                                label="Azure Account Name Write"
                                variant="outlined"
                                fullWidth
                                value={azureAccountNameWrite}
                                onChange={(e) => setAzureAccountNameWrite(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                            <TextField
                                id="azure-account-key-Write"
                                label="Azure Account Key-Write"
                                variant="outlined"
                                fullWidth
                                type="password"
                                value={azureAccountKeyWrite}
                                onChange={(e) => setAzureAccountKeyWrite(e.target.value)}
                                sx={{ mt: 2 }}
                            />
                        </>
                    )}
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        sx={{ mt: 2 }}
                    >
                        Submit
                    </Button>
                </Box>
            </Modal>
        </div>
    );
};

export default CreateConnectorButton;
