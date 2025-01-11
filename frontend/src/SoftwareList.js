import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const API_URL = "/software";

    useEffect(() => {
        fetchSoftwares();
    }, []);

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
        } catch (error) {
            handleServerError(
                isEditing ? "Errore nell'aggiornamento del software" : "Errore nella creazione del software",
                error
            );
        }
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
        toast.error(`${message}: ${error.response?.data?.message || error.response?.data || "Errore inatteso"}`, {
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

    return (
        <div className="container my-4">
            <h1>SOUP Manager</h1>
            <ToastContainer />
            {/* Form di ricerca */}
            <form onSubmit={handleSearch} className="my-4">
                <div className="input-group mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Cerca software..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-primary" type="submit">
                        Cerca
                    </button>
                </div>
            </form>
            <form onSubmit={handleSubmit} className="my-4">
                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Software ID</label>
                        <input
                            type="text"
                            className="form-control"
                            name="softwareId"
                            value={formData.softwareId}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Manufacturer</label>
                        <input
                            type="text"
                            className="form-control"
                            name="manufacturer"
                            value={formData.manufacturer}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Website</label>
                        <input
                            type="text"
                            className="form-control"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">License</label>
                        <input
                            type="text"
                            className="form-control"
                            name="license"
                            value={formData.license}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Version</label>
                        <input
                            type="text"
                            className="form-control"
                            name="version"
                            value={formData.version}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Release Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="releaseDate"
                            value={formData.releaseDate}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">End of Support Date</label>
                        <input
                            type="date"
                            className="form-control"
                            name="endOfSupportDate"
                            value={formData.endOfSupportDate}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Programming Language</label>
                        <input
                            type="text"
                            className="form-control"
                            name="programmingLanguage"
                            value={formData.programmingLanguage}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Units</label>
                        <input
                            type="text"
                            className="form-control"
                            name="units"
                            value={formData.units}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Hardware Specifications</label>
                        <input
                            type="text"
                            className="form-control"
                            name="hardwareSpecifications"
                            value={formData.hardwareSpecifications}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Software Specifications</label>
                        <input
                            type="text"
                            className="form-control"
                            name="softwareSpecifications"
                            value={formData.softwareSpecifications}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Installation Procedures</label>
                        <input
                            type="text"
                            className="form-control"
                            name="installationProcedures"
                            value={formData.installationProcedures}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Configuration Requirements</label>
                        <input
                            type="text"
                            className="form-control"
                            name="configurationRequirements"
                            value={formData.configurationRequirements}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Training Requirements</label>
                        <input
                            type="text"
                            className="form-control"
                            name="trainingRequirements"
                            value={formData.trainingRequirements}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Design Limitations</label>
                        <input
                            type="text"
                            className="form-control"
                            name="designLimitations"
                            value={formData.designLimitations}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Maintenance Procedures</label>
                        <input
                            type="text"
                            className="form-control"
                            name="maintenanceProcedures"
                            value={formData.maintenanceProcedures}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Function</label>
                        <input
                            type="text"
                            className="form-control"
                            name="function"
                            value={formData.function}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Measures To Prevent Incorrect Version</label>
                        <input
                            type="text"
                            className="form-control"
                            name="measuresToPreventIncorrectVersion"
                            value={formData.measuresToPreventIncorrectVersion}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="col">
                        <label className="form-label">Storage</label>
                        <input
                            type="text"
                            className="form-control"
                            name="storage"
                            value={formData.storage}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="row mb-3">
                    <div className="col">
                        <label className="form-label">Documentation</label>
                        <input
                            type="text"
                            className="form-control"
                            name="documentation"
                            value={formData.documentation}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <button type="submit" className="btn btn-primary">
                    {isEditing ? "Salva Modifiche" : "Aggiungi Software"}
                </button>
            </form>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Software ID</th>
                        <th>Name</th>
                        <th>Manufacturer</th>
                        <th>Azioni</th>
                    </tr>
                </thead>
                <tbody>
                    {softwares.map((software) => (
                        <tr key={software.id}>
                            <td>{software.id}</td>
                            <td>{software.softwareId}</td>
                            <td>{software.name}</td>
                            <td>{software.manufacturer}</td>
                            <td>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => handleEdit(software)}
                                >
                                    Modifica
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(software.id)}
                                >
                                    Elimina
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default SoftwareList;
