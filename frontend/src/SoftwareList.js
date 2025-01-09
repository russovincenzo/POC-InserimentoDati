import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

    const API_URL = "/software"; // Adatta l'URL se necessario

    // Carica tutti i software all'avvio
    useEffect(() => {
        fetchSoftwares();
    }, []);

    const fetchSoftwares = async () => {
        try {
            const response = await axios.get(API_URL);
            setSoftwares(response.data);
        } catch (error) {
            console.error("Errore nel recupero dei software:", error);
        }
    };

    // Gestisce il cambiamento nel form
    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Crea o modifica un software
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            // EDIT: PUT
            try {
                await axios.put(`${API_URL}/${formData.id}`, formData);
                setIsEditing(false);
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
                fetchSoftwares();
            } catch (error) {
                console.error("Errore nell'aggiornamento del software:", error);
            }
        } else {
            // CREATE: POST
            try {
                await axios.post(API_URL, formData);
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
                fetchSoftwares();
            } catch (error) {
                console.error("Errore nella creazione del software:", error);
            }
        }
    };

    // Seleziona un software da modificare
    const handleEdit = (software) => {
        setIsEditing(true);
        setFormData(software);
    };

    // Elimina un software
    const handleDelete = async (id) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchSoftwares();
        } catch (error) {
            console.error("Errore nell'eliminazione del software:", error);
        }
    };

    return (
        <div className="container my-4">
            <h1>Gestione Software</h1>

            {/* Form di inserimento / modifica */}
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
                </div>

                {/* Aggiungi qui altre righe/colonne di campi input in base alle esigenze */}
                <div className="row mb-3">
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

                <button type="submit" className="btn btn-primary">
                    {isEditing ? "Salva Modifiche" : "Aggiungi Software"}
                </button>
            </form>

            {/* Tabella software */}
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
