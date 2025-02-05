import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Typeahead } from 'react-bootstrap-typeahead';
import {
    Button,
    ProgressBar,
    Form,
    Row,
    Col,
    FloatingLabel,
    Table
} from 'react-bootstrap';
import { FaEdit, FaTrash } from 'react-icons/fa'; // Importa icone FontAwesome

const FORM_CACHE_KEY = 'softwareFormData';

function SoftwareList() {
    const [softwares, setSoftwares] = useState([]);
    const [formData, setFormData] = useState({
        id: 0,
        softwareId: "",
        name: "",
        manufacturer: "",
        website: "",
        license: "",
        version: "",
        releaseDate: "",
        endOfSupportDate: "",
        programmingLanguage: "",
        units: "",
        hardwareSpecifications: "",
        softwareSpecifications: "",
        installationProcedures: "",
        configurationRequirements: "",
        trainingRequirements: "",
        designLimitations: "",
        maintenanceProcedures: "",
        function: "",
        measuresToPreventIncorrectVersion: "",
        storage: "",
        documentation: ""
    });
    const getUrl = (endpoint) => {
        return process.env.NODE_ENV === 'development' ? "https://localhost:7065" + endpoint : endpoint;
    }

    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [unitsOptions, setUnitsOptions] = useState([]);
    const API_URL = getUrl("/software");
    const UNITS_API_URL = getUrl("/units");
    const [currentStep, setCurrentStep] = useState(1);

    
    useEffect(() => {
        fetchSoftwares();
        // Load form data from localStorage on component mount
        const cachedData = localStorage.getItem(FORM_CACHE_KEY);
        if (cachedData) {
            setFormData(JSON.parse(cachedData));
        }
    }, []);

    useEffect(() => {
        // Update localStorage whenever formData changes
        localStorage.setItem(FORM_CACHE_KEY, JSON.stringify(formData));
    }, [formData]);

    const fetchUnits = async (query = "") => {
        try {
            const response = await axios.get(`${UNITS_API_URL}?query=${query}`);
            setUnitsOptions(response.data);
        } catch (error) {
            handleServerError("Errore nel recupero delle unità", error);
        }
    };

    const fetchSoftwares = async (query = "") => {
        try {
            const response = await axios.get(`${API_URL}?query=${query}`);
            setSoftwares(response.data);
        } catch (error) {
            handleServerError("Errore nel recupero dei software", error);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await axios.put(`${API_URL}/${formData.id}`, formData);
                setIsEditing(false);
            } else {
                await axios.post(API_URL, formData);
            }
            resetFormData();
            fetchSoftwares();
            // Remove data from localStorage after successful submission
            localStorage.removeItem(FORM_CACHE_KEY);
            toast.success("Software salvato con successo!", { autoClose: 3000 }); // Show success toast
        } catch (error) {
            handleServerError(
                isEditing ? "Errore nell'aggiornamento del software" : "Errore nella creazione del software",
                error
            );
        }
    };

    const handleTypeaheadChange = (selected, e) => {
        setFormData(prev => ({
            ...prev,
            units: selected.length > 0 && selected[0].customOption ? selected[0].label : selected[0]
        }));
    };

    const handleUnitsInputChange = (query) => {
        fetchUnits(query);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchSoftwares(searchQuery);
    };

    const handleEdit = (software) => {
        setIsEditing(true);
        setFormData(software);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchSoftwares();
        } catch (error) {
            handleServerError("Errore nell'eliminazione del software", error);
        }
    };

    const handleServerError = (message, error) => {
        console.error(message, error);
        toast.error(`${message}: ${error.response?.data?.message || "Errore inatteso"}`, {
            autoClose: 10000,
        });
    };

    const resetFormData = () => {
        setFormData({
            id: 0,
            softwareId: "",
            name: "",
            manufacturer: "",
            website: "",
            license: "",
            version: "",
            releaseDate: "",
            endOfSupportDate: "",
            programmingLanguage: "",
            units: "",
            hardwareSpecifications: "",
            softwareSpecifications: "",
            installationProcedures: "",
            configurationRequirements: "",
            trainingRequirements: "",
            designLimitations: "",
            maintenanceProcedures: "",
            function: "",
            measuresToPreventIncorrectVersion: "",
            storage: "",
            documentation: ""
        });
    };

    const nextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <StepOne formData={formData} handleChange={handleChange} />;
            case 2:
                return (
                    <StepTwo
                        formData={formData}
                        handleChange={handleChange}
                        unitsOptions={unitsOptions}
                        handleTypeaheadChange={handleTypeaheadChange}
                        handleUnitsInputChange={handleUnitsInputChange}
                    />
                );
            case 3:
                return <StepThree formData={formData} handleChange={handleChange} />;
            default:
                return null;
        }
    };

    const stepPercentage = ((currentStep - 1) / 3) * 100;

    return (
        <div className="container my-4">
            <h1>SOUP Manager</h1>
            <ToastContainer />

            {/* Form di ricerca */}
            <Form onSubmit={handleSearch} className="my-4">
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Cerca software..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">
                    Cerca
                </Button>
            </Form>
            <ProgressBar now={stepPercentage} label={`Step ${currentStep} of 3`} />

            <Form onSubmit={handleSubmit} className="my-4">
                {/* Fixed height container for the step content */}
                <div style={{ minHeight: '400px' }}>
                    {renderStepContent()}
                </div>

                <div className="d-flex justify-content-between">
                    {currentStep > 1 && (
                        <Button variant="secondary" onClick={prevStep}>
                            Indietro
                        </Button>
                    )}
                    {currentStep < 3 && (
                        <Button variant="primary" onClick={nextStep}>
                            Avanti
                        </Button>
                    )}
                    {currentStep === 3 && (
                        <Button type="submit" variant="success">
                            {isEditing ? "Salva Modifiche" : "Aggiungi Software"}
                        </Button>
                    )}
                </div>
            </Form>

            <Table striped bordered hover responsive> {/* Aggiunto 'responsive' per scroll orizzontale su schermi piccoli */}
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Software ID</th>
                        <th>Name</th>
                        <th>Units</th>
                        <th>Manufacturer</th>
                        <th className="text-center">Azioni</th> {/* Allinea le azioni al centro */}
                    </tr>
                </thead>
                <tbody>
                    {softwares.map((software) => (
                        <tr key={software.id}>
                            <td>{software.id}</td>
                            <td>{software.softwareId}</td>
                            <td>{software.name}</td>
                            <td>{software.units}</td>
                            <td>{software.manufacturer}</td>
                            <td className="text-center">
                                <Button variant="outline-warning" size="sm" className="me-1" onClick={() => handleEdit(software)}>
                                    <FaEdit /> {/* Icona Modifica */}
                                </Button>
                                <Button variant="outline-danger" size="sm" onClick={() => handleDelete(software.id)}>
                                    <FaTrash /> {/* Icona Elimina */}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
}

function StepOne({ formData, handleChange }) {
    return (
        <Form>
            <Row className="mb-3">
                <Col>
                    <FloatingLabel controlId="softwareIdLabel" label="Software ID">
                        <Form.Control
                            type="text"
                            name="softwareId"
                            value={formData.softwareId}
                            onChange={handleChange}
                            placeholder="Software ID"
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel controlId="nameLabel" label="Name">
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Name"
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel controlId="manufacturerLabel" label="Manufacturer">
                        <Form.Control
                            type="text"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleChange}
                            placeholder="Manufacturer"
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel controlId="websiteLabel" label="Website">
                        <Form.Control
                            type="text"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="Website"
                        />
                    </FloatingLabel>
                </Col>
            </Row>
        </Form>
    );
}

function StepTwo({ formData, handleChange, unitsOptions, handleTypeaheadChange, handleUnitsInputChange }) {
    return (
        <Form>
            <Row className="mb-3">
                <Col>
                    <FloatingLabel controlId="licenseLabel" label="License">
                        <Form.Control
                            type="text"
                            name="license"
                            value={formData.license}
                            onChange={handleChange}
                            placeholder="License"
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel controlId="versionLabel" label="Version">
                        <Form.Control
                            type="text"
                            name="version"
                            value={formData.version}
                            onChange={handleChange}
                            placeholder="Version"
                        />
                    </FloatingLabel>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <FloatingLabel controlId="releaseDateLabel" label="Release Date">
                        <Form.Control
                            type="date"
                            name="releaseDate"
                            value={formData.releaseDate}
                            onChange={handleChange}
                            placeholder="Release Date"
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel controlId="endOfSupportDateLabel" label="End of Support Date">
                        <Form.Control
                            type="date"
                            name="endOfSupportDate"
                            value={formData.endOfSupportDate}
                            onChange={handleChange}
                            placeholder="End of Support Date"
                        />
                    </FloatingLabel>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <FloatingLabel controlId="programmingLanguageLabel" label="Programming Language">
                        <Form.Control
                            type="text"
                            name="programmingLanguage"
                            value={formData.programmingLanguage}
                            onChange={handleChange}
                            placeholder="Programming Language"
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <Form.Group controlId="unitsLabel">
                        <Form.Label>Units</Form.Label>
                        <Typeahead
                            id="units-typeahead"
                            onChange={handleTypeaheadChange}
                            onInputChange={handleUnitsInputChange}
                            options={unitsOptions}
                            selected={formData.units ? [formData.units] : []}
                            placeholder="Scegli un'unità..."
                            allowNew
                            newSelectionPrefix="Aggiungi: "
                            minLength={1} // Specify when to start showing suggestions
                        />
                    </Form.Group>
                </Col>
            </Row>
        </Form>
    );
}

function StepThree({ formData, handleChange }) {
    return (
        <Form>
            <Row className="mb-3">
                <Col>
                    <FloatingLabel controlId="hardwareSpecificationsLabel" label="Hardware Specifications">
                        <Form.Control
                            type="text"
                            name="hardwareSpecifications"
                            value={formData.hardwareSpecifications}
                            onChange={handleChange}
                            placeholder="Hardware Specifications"
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel controlId="softwareSpecificationsLabel" label="Software Specifications">
                        <Form.Control
                            type="text"
                            name="softwareSpecifications"
                            value={formData.softwareSpecifications}
                            onChange={handleChange}
                            placeholder="Software Specifications"
                        />
                    </FloatingLabel>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <FloatingLabel controlId="installationProceduresLabel" label="Installation Procedures">
                        <Form.Control
                            type="text"
                            name="installationProcedures"
                            value={formData.installationProcedures}
                            onChange={handleChange}
                            placeholder="Installation Procedures"
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel controlId="configurationRequirementsLabel" label="Configuration Requirements">
                        <Form.Control
                            type="text"
                            name="configurationRequirements"
                            value={formData.configurationRequirements}
                            onChange={handleChange}
                            placeholder="Configuration Requirements"
                        />
                    </FloatingLabel>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <FloatingLabel controlId="trainingRequirementsLabel" label="Training Requirements">
                        <Form.Control
                            type="text"
                            name="trainingRequirements"
                            value={formData.trainingRequirements}
                            onChange={handleChange}
                            placeholder="Training Requirements"
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel controlId="designLimitationsLabel" label="Design Limitations">
                        <Form.Control
                            type="text"
                            name="designLimitations"
                            value={formData.designLimitations}
                            onChange={handleChange}
                            placeholder="Design Limitations"
                        />
                    </FloatingLabel>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <FloatingLabel controlId="maintenanceProceduresLabel" label="Maintenance Procedures">
                        <Form.Control
                            type="text"
                            name="maintenanceProcedures"
                            value={formData.maintenanceProcedures}
                            onChange={handleChange}
                            placeholder="Maintenance Procedures"
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel controlId="functionLabel" label="Function">
                        <Form.Control
                            type="text"
                            name="function"
                            value={formData.function}
                            onChange={handleChange}
                            placeholder="Function"
                        />
                    </FloatingLabel>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <FloatingLabel controlId="measuresToPreventIncorrectVersionLabel" label="Measures To Prevent Incorrect Version">
                        <Form.Control
                            type="text"
                            name="measuresToPreventIncorrectVersion"
                            value={formData.measuresToPreventIncorrectVersion}
                            onChange={handleChange}
                            placeholder="Measures To Prevent Incorrect Version"
                        />
                    </FloatingLabel>
                </Col>
                <Col>
                    <FloatingLabel controlId="storageLabel" label="Storage">
                        <Form.Control
                            type="text"
                            name="storage"
                            value={formData.storage}
                            onChange={handleChange}
                            placeholder="Storage"
                        />
                    </FloatingLabel>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col>
                    <FloatingLabel controlId="documentationLabel" label="Documentation">
                        <Form.Control
                            type="text"
                            name="documentation"
                            value={formData.documentation}
                            onChange={handleChange}
                            placeholder="Documentation"
                        />
                    </FloatingLabel>
                </Col>
            </Row>
        </Form>
    );
}

export default SoftwareList;