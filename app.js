// =====================================================
// Open Field Studio - Main Application
// Inspectie, Oplevering & Kwaliteitsborging
// =====================================================

const CATEGORIES = ['Bouwkundig','Schilderwerk','Sanitair','Elektra','HVAC','Dakwerk','Kozijnen','Vloeren','Buitenruimte','Veiligheid','Overig'];
const STATUS_LABELS = { open:'Open', assigned:'Toegewezen', completed:'Afgerond', verified:'Geverifieerd', archived:'Gearchiveerd' };
const PRIORITY_LABELS = { high:'Hoog', medium:'Midden', low:'Laag' };
const SEVERITY_LABELS = { cosmetic:'Cosmetisch', functional:'Functioneel', safety:'Veiligheid', structural:'Structureel' };
const HO_TYPE_LABELS = { pre:'Vooroplevering', first:'Eerste oplevering', second:'Tweede oplevering' };

class OpenFieldStudio {
    constructor() {
        this.project = { name:'',number:'',client:'',contactPerson:'',address:'',postalCode:'',city:'',surveyDate:'',surveyor:'',description:'',notes:'' };
        this.contacts = [];
        this.floorPlans = [];
        this.tickets = [];
        this.inspections = [];
        this.handovers = [];
        this.checklistTemplates = this.getDefaultTemplates();
        this.activeFloorPlanId = null;
        this.isAddingPoint = false;
        this.zoomLevel = 1;
        this.editingPointId = null;
        this.currentPhotos = [];
        this.currentInspectionId = null;
        this.currentHandoverId = null;
        this.activityLog = [];
        this.init();
    }

    init() {
        this.bindEvents();
        this.setDefaultDate();
        this.loadFromLocalStorage();
        this.validateAndCleanData();
        this.populateCategoryFilter();
    }

    // =====================================================
    // DEFAULT CHECKLIST TEMPLATES
    // =====================================================
    getDefaultTemplates() {
        return [
            {
                id: 'tpl_bouwkundig', name: 'Bouwkundige opname', category: 'Bouwkundig',
                items: [
                    'Staat van het metselwerk / gevelstenen','Voegen in goede conditie','Betonwerk vrij van scheuren','Houten constructiedelen vrij van rot',
                    'Staalconstructie vrij van roest','Dakbedekking waterdicht','Dakgoten en hemelwaterafvoer functioneel','Kozijnen in goede staat',
                    'Beglazing heel en goed gekit','Buitendeuren sluiten goed','Vloeren vlak en zonder scheuren','Wanden recht en zonder scheuren',
                    'Plafonds vrij van vlekken/scheuren','Trappen veilig en stevig','Balkon/galerij in goede staat','Fundering geen zichtbare gebreken'
                ]
            },
            {
                id: 'tpl_installatie', name: 'Installatie-inspectie', category: 'Installaties',
                items: [
                    'Elektra: groepenkast correct gelabeld','Elektra: aardlekschakelaars werken','Elektra: stopcontacten functioneel','Elektra: verlichtingspunten werken',
                    'Water: geen lekkages zichtbaar','Water: warm watervoorziening werkt','Water: waterdruk voldoende','Sanitair: toiletten spoelen goed',
                    'Sanitair: kranen lekvrij','Verwarming: radiatoren worden warm','Verwarming: thermostaat functioneel','Ventilatie: mechanische ventilatie werkt',
                    'Ventilatie: roosters open en schoon','Ventilatie: afzuiging keuken/badkamer werkt','Gas: leidingen lekvrij','Intercom/belsysteem werkt'
                ]
            },
            {
                id: 'tpl_veiligheid', name: 'Veiligheidsinspectie', category: 'Veiligheid',
                items: [
                    'Rookmelders aanwezig en werkend','CO-melders aanwezig (bij gastoestellen)','Brandblusser aanwezig en gekeurd','Vluchtwegen vrij en gemarkeerd',
                    'Noodverlichting functioneel','Brandwerende deuren sluiten goed','Trapleuningen stevig bevestigd','Glazen puien gemarkeerd',
                    'Elektrische installatie NEN 1010 conform','Gasinstallatie gekeurd','Valbeveiliging op hoogte aanwezig','EHBO-voorzieningen aanwezig',
                    'Veiligheidsglas waar vereist','Anti-slip voorzieningen natte ruimtes'
                ]
            },
            {
                id: 'tpl_oplevering', name: 'Oplevering voorinspectie', category: 'Oplevering',
                items: [
                    'Schilderwerk: dekkend en strak afgewerkt','Schilderwerk: geen verfdruppels/vlekken','Behang: strak geplakt, geen bobbels','Tegelwerk: rechte voegen, geen beschadigingen',
                    'Voegen: netjes afgewerkt','Kitwerk: strak aangebracht','Plinten: recht en netjes bevestigd','Deuren: sluiten goed, geen klemmen',
                    'Ramen: openen en sluiten soepel','Vloer: schoon en onbeschadigd','Schoonmaak: bouwstof verwijderd','Schoonmaak: ramen gewassen',
                    'Alle ruimtes toegankelijk','Sleutels/tags compleet','Handleidingen aanwezig','Meterstanden opgenomen'
                ]
            },
            {
                id: 'tpl_wkb', name: 'Wkb-basiscontrole', category: 'Wkb',
                items: [
                    'Constructieve veiligheid: conform berekening','Brandveiligheid: compartimentering correct','Brandveiligheid: vluchtroutes conform ontwerp',
                    'Gebruiksveiligheid: trappen conform Bouwbesluit','Gebruiksveiligheid: balustrades juiste hoogte','Energieprestatie: isolatie conform EPC-berekening',
                    'Energieprestatie: luchtdichtheid gemeten','Geluid: contactgeluidisolatie voldoende','Geluid: luchtgeluidisolatie voldoende',
                    'Ventilatie: capaciteit conform Bouwbesluit','Daglicht: raamoppervlak voldoende','Toegankelijkheid: drempels conform eisen',
                    'Waterhuishouding: afvoer hemelwater correct','Funderingsrapport beschikbaar','Constructieberekening beschikbaar','Borgingsplan gevolgd'
                ]
            },
            // ===== ENERGIELABEL TEMPLATE =====
            {
                id: 'tpl_energielabel', name: 'Energielabel - Volledige opname', category: 'Energielabel',
                scoring: 'nen2767',
                items: [
                    // --- Woninggegevens ---
                    '[WONINGGEGEVENS] Woningtype: vrijstaand/2-onder-1-kap/rij/hoek/appartement',
                    '[WONINGGEGEVENS] Bouwjaar vastgesteld en genoteerd',
                    '[WONINGGEGEVENS] Gebruiksoppervlak opgemeten in m²',
                    '[WONINGGEGEVENS] Aantal bouwlagen vastgesteld',
                    '[WONINGGEGEVENS] Kruipruimte: aanwezig ja/nee en hoogte',
                    // --- Gebouwschil ---
                    '[SCHIL] Gevelisolatie: type en dikte vastgesteld',
                    '[SCHIL] Gevelisolatie: spouwmuurisolatie aanwezig',
                    '[SCHIL] Dakisolatie: type en dikte vastgesteld',
                    '[SCHIL] Dakisolatie: Rc-waarde voldoende',
                    '[SCHIL] Vloerisolatie: type en dikte vastgesteld',
                    '[SCHIL] Vloerisolatie: kruipruimte geisoleerd',
                    '[SCHIL] Kozijnen: materiaal en staat geregistreerd',
                    '[SCHIL] Beglazing: type per raam (enkel/dubbel/triple/HR++)',
                    '[SCHIL] Beglazing: U-waarde genoteerd',
                    '[SCHIL] Kierdichting: staat van tochtstrippen en kitten',
                    '[SCHIL] Luchtdichtheid: zichtbare kieren en naden',
                    '[SCHIL] Thermische bruggen: koudebruggen geidentificeerd',
                    '[SCHIL] Oriëntatie en beschaduwing vastgelegd',
                    // --- Verwarming ---
                    '[VERWARMING] Type systeem (CV/warmtepomp/stadsverwarming)',
                    '[VERWARMING] Merk, type en bouwjaar ketel',
                    '[VERWARMING] HR-label en rendement genoteerd',
                    '[VERWARMING] Afgiftesysteem (radiatoren/vloerverwarming)',
                    '[VERWARMING] Regeling (thermostaat/zonesturing)',
                    // --- Warm water ---
                    '[WARM WATER] Type opwekking',
                    '[WARM WATER] Apart of combi met verwarming',
                    // --- Ventilatie ---
                    '[VENTILATIE] Type systeem (natuurlijk/mechanisch/WTW)',
                    '[VENTILATIE] WTW rendement indien aanwezig',
                    '[VENTILATIE] CO2-gestuurd of vraaggestuurd',
                    // --- Koeling ---
                    '[KOELING] Type systeem indien aanwezig',
                    '[KOELING] SEER-waarde genoteerd',
                    // --- Duurzame energie ---
                    '[DUURZAAM] Zonnepanelen: aantal, vermogen (Wp), merk/type',
                    '[DUURZAAM] Zonnepanelen: factuur/documentatie aanwezig',
                    '[DUURZAAM] Zonneboiler: aanwezig en type',
                    '[DUURZAAM] Energieopslag: batterijsysteem aanwezig',
                    '[DUURZAAM] Gasaansluiting: aanwezig of verwijderd',
                    '[DUURZAAM] Gebouwautomatisering: slim regelsysteem',
                    // --- Fotodocumentatie ---
                    '[FOTO] Buitenzijde: voor- en achtergevel',
                    '[FOTO] CV-ketel: typeplaatje zichtbaar',
                    '[FOTO] Groepenkast: duidelijk leesbaar',
                    '[FOTO] Zonnepanelen: aantal telbaar',
                    '[FOTO] Ventilatie: unit en roosters',
                    '[FOTO] Beglazing: type herkenbaar',
                    // --- Afsluiting ---
                    '[AFRONDING] Bewijsstukken: facturen isolatie/installaties verzameld',
                    '[AFRONDING] EP-Online registratie: gegevens compleet voor invoer'
                ]
            },
            // ===== MONUMENT TEMPLATES =====
            {
                id: 'tpl_monument_constructie', name: 'Monument - Constructie & Schil', category: 'Monument',
                scoring: 'nen2767',
                items: [
                    'Fundering: type en zichtbare staat','Fundering: zettingsverschillen of verzakking','Dragende muren: scheuren of vervorming',
                    'Metselwerk: voegwerk staat','Metselwerk: baksteenconditie (verwering/afbladdering)','Metselwerk: zoutuitbloei (efflorescentie)',
                    'Natuursteen: verwering en afschilfering','Houtconstructie: balken en spanten op rot/insect','Houtconstructie: verbindingen en opleggingen',
                    'Dakconstructie: gordingen en sporen','Dakbedekking: leien/pannen/lood/zink staat','Dakgoten en hemelwaterafvoer',
                    'Schoorstenen: metselwerk en voegwerk','Gevelankers: aanwezig en functioneel','Kozijnen: origineel houtwerk staat',
                    'Ramen: originele beglazing en loodwerk','Luiken en blinden: staat en bevestiging','Geveldecoratie: lijstwerk, ornamenten, reliëfs'
                ]
            },
            {
                id: 'tpl_monument_interieur', name: 'Monument - Historisch Interieur', category: 'Monument',
                scoring: 'nen2767',
                items: [
                    'Originele vloeren: type, materiaal en conditie','Originele plafonds: stucwerk, balken, ornamenten','Originele wanden: betimmering, lambrisering',
                    'Schouwen en haarden: staat en volledigheid','Trappen: origineel houtwerk en leuningen','Deuren: originele paneeldeuren en beslag',
                    'Raamluiken: binnenzijde origineel','Tegeltableaus: compleet en onbeschadigd','Schilderingen/muurschilderingen: zichtbaar of verborgen',
                    'Glas-in-lood: staat en volledigheid','Smeedwerk: trapleuningen, hekwerken, beslag','Plafondrozetten en lijstwerk',
                    'Originele verflagen: kleuronderzoek nodig','Keldergewelven: metselwerk staat','Zolderruimte: originele elementen zichtbaar'
                ]
            },
            {
                id: 'tpl_monument_schade', name: 'Monument - Vocht & Schade', category: 'Monument',
                scoring: 'nen2767',
                items: [
                    'Vochtmeting: muren begane grond','Vochtmeting: kelderwanden','Optrekkend vocht: zichtbare vochtgrens',
                    'Inregenend vocht: gevel en kozijnaansluitingen','Condensvocht: ramen en koudebruggen','Schimmels: zichtbare schimmelvorming locaties',
                    'Algen/mossen: gevel en dak','Zoutschade: locaties en ernst','Houtaantasting: zwam of boktor',
                    'Scheuren: locatie, richting, breedte (mm)','Scheuren: actief of historisch','Verzakking: zichtbare scheefstand',
                    'Afbladdering: verf en coating','Verwering: natuursteen oppervlak','Vorstschade: baksteen en voegen',
                    'Loodwerk: daksluitingen en goten','Zinkwerk: staat en aansluiting','Biologische aantasting: klimop/begroeiing'
                ]
            },
            {
                id: 'tpl_monument_onderhoud', name: 'Monument - Instandhoudingsplan', category: 'Monument',
                scoring: 'nen2767',
                items: [
                    'Dak: onderhoud komende 6 jaar gepland','Gevel: voegwerk herstel nodig binnen 6 jaar','Kozijnen: schilderwerk planning',
                    'Hemelwaterafvoer: reiniging en reparatie','Schilderwerk buiten: staat en planning','Schilderwerk binnen: staat en planning',
                    'Lood- en zinkwerk: vervanging/reparatie nodig','Riolering: staat en leeftijd','Elektra: keuring en vervanging nodig',
                    'Verwarming: onderhoud en vervanging','Vochtbehandeling: maatregelen nodig','Houtrotreparatie: locaties en urgentie',
                    'Restauratie-elementen: specificatie vereist','Kosten korte termijn (0-2 jaar) geschat','Kosten middellange termijn (2-6 jaar) geschat',
                    'Kosten lange termijn (6-12 jaar) geschat','SIM-subsidie: aanvraag voorbereid','Monumentenvergunning: nodig voor werkzaamheden'
                ]
            }
        ];
    }

    // =====================================================
    // EVENT BINDINGS
    // =====================================================
    bindEvents() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.closest('.nav-btn').dataset.tab));
        });

        // Project Form
        document.getElementById('save-project').addEventListener('click', () => this.saveProject());
        document.getElementById('project-form').addEventListener('input', () => this.autoSaveProject());

        // Contacts
        document.getElementById('add-contact-btn').addEventListener('click', () => this.openContactModal());
        document.getElementById('save-contact').addEventListener('click', () => this.saveContact());
        document.getElementById('cancel-contact').addEventListener('click', () => this.closeContactModal());
        document.getElementById('delete-contact').addEventListener('click', () => this.deleteContact());
        document.getElementById('contact-modal-close').addEventListener('click', () => this.closeContactModal());
        document.querySelector('#contact-modal .modal-overlay').addEventListener('click', () => this.closeContactModal());

        // Floor Plan Upload
        const uploadZone = document.getElementById('floor-plan-upload');
        const uploadInput = document.getElementById('floor-plan-input');
        uploadZone.addEventListener('click', () => uploadInput.click());
        uploadZone.addEventListener('dragover', (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); });
        uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
        uploadZone.addEventListener('drop', (e) => { e.preventDefault(); uploadZone.classList.remove('dragover'); this.processFloorPlanFiles(e.dataTransfer.files); });
        uploadInput.addEventListener('change', (e) => { this.processFloorPlanFiles(e.target.files); e.target.value = ''; });

        // Floor Plan Selection & Filters
        document.getElementById('active-floor').addEventListener('change', (e) => this.setActiveFloorPlan(e.target.value));
        document.getElementById('filter-status').addEventListener('change', () => this.renderPointsList());
        document.getElementById('filter-category').addEventListener('change', () => this.renderPointsList());
        document.getElementById('filter-priority').addEventListener('change', () => this.renderPointsList());

        // Canvas Tools
        document.getElementById('add-point-btn').addEventListener('click', () => this.toggleAddPointMode());
        document.getElementById('zoom-in-btn').addEventListener('click', () => this.zoom(0.25));
        document.getElementById('zoom-out-btn').addEventListener('click', () => this.zoom(-0.25));
        document.getElementById('zoom-fit-btn').addEventListener('click', () => this.zoomFit());
        document.getElementById('floor-plan-wrapper').addEventListener('click', (e) => this.handleCanvasClick(e));

        // Ticket Modal
        document.getElementById('modal-close').addEventListener('click', () => this.closePointModal());
        document.getElementById('cancel-point').addEventListener('click', () => this.closePointModal());
        document.getElementById('save-point').addEventListener('click', () => this.savePoint());
        document.getElementById('delete-point').addEventListener('click', () => this.deletePoint());
        document.querySelector('#point-modal .modal-overlay').addEventListener('click', () => this.closePointModal());
        document.getElementById('add-comment-btn').addEventListener('click', () => this.addComment());
        document.getElementById('new-comment').addEventListener('keydown', (e) => { if (e.key === 'Enter') this.addComment(); });

        // Photo Upload
        const photoUpload = document.getElementById('photo-upload');
        const photoInput = document.getElementById('photo-input');
        photoUpload.addEventListener('click', () => photoInput.click());
        photoUpload.addEventListener('dragover', (e) => { e.preventDefault(); photoUpload.classList.add('dragover'); });
        photoUpload.addEventListener('dragleave', () => photoUpload.classList.remove('dragover'));
        photoUpload.addEventListener('drop', (e) => { e.preventDefault(); photoUpload.classList.remove('dragover'); this.processPhotoFiles(e.dataTransfer.files); });
        photoInput.addEventListener('change', (e) => { this.processPhotoFiles(e.target.files); e.target.value = ''; });

        // Camera
        document.getElementById('camera-btn').addEventListener('click', () => this.openCamera());
        document.getElementById('camera-capture').addEventListener('click', () => this.capturePhoto());
        document.getElementById('camera-cancel').addEventListener('click', () => this.closeCamera());
        document.getElementById('camera-modal-close').addEventListener('click', () => this.closeCamera());
        document.getElementById('camera-switch').addEventListener('click', () => this.switchCamera());
        document.querySelector('#camera-modal .modal-overlay').addEventListener('click', () => this.closeCamera());

        // Photo Viewer
        document.getElementById('photo-viewer-close').addEventListener('click', () => this.closePhotoViewer());
        document.getElementById('photo-prev').addEventListener('click', () => this.navigatePhoto(-1));
        document.getElementById('photo-next').addEventListener('click', () => this.navigatePhoto(1));
        document.querySelector('#photo-viewer-modal .modal-overlay').addEventListener('click', () => this.closePhotoViewer());

        // Inspectie
        document.getElementById('new-inspection-btn').addEventListener('click', () => this.showInspectionSetup());
        document.getElementById('cancel-inspection-setup').addEventListener('click', () => this.showInspectionOverview());
        document.getElementById('start-inspection-btn').addEventListener('click', () => this.startInspection());
        document.getElementById('back-to-inspections').addEventListener('click', () => this.showInspectionOverview());
        document.getElementById('finish-inspection-btn').addEventListener('click', () => this.showSignature());
        document.getElementById('clear-signature').addEventListener('click', () => this.clearSignatureCanvas());
        document.getElementById('cancel-sign').addEventListener('click', () => this.showInspectionExecution());
        document.getElementById('confirm-sign').addEventListener('click', () => this.signInspection());

        // Oplevering
        document.getElementById('new-handover-btn').addEventListener('click', () => this.showHandoverSetup());
        document.getElementById('cancel-handover-setup').addEventListener('click', () => this.showHandoverOverview());
        document.getElementById('add-ho-participant').addEventListener('click', () => this.addHandoverParticipant());
        document.getElementById('start-handover-btn').addEventListener('click', () => this.startHandover());
        document.getElementById('back-to-handovers').addEventListener('click', () => this.showHandoverOverview());
        document.getElementById('finish-handover-btn').addEventListener('click', () => this.showHandoverSign());
        document.getElementById('add-ho-signature').addEventListener('click', () => this.addHandoverSignatureBlock());
        document.getElementById('cancel-ho-sign').addEventListener('click', () => this.showHandoverExecution());
        document.getElementById('confirm-ho-sign').addEventListener('click', () => this.signHandover());

        // Handover documents
        const hoDocUpload = document.getElementById('ho-doc-upload');
        const hoDocInput = document.getElementById('ho-doc-input');
        hoDocUpload.addEventListener('click', () => hoDocInput.click());
        hoDocInput.addEventListener('change', (e) => { this.processHandoverDocs(e.target.files); e.target.value = ''; });

        // Export
        document.getElementById('export-html').addEventListener('click', () => this.exportHTML());
        document.getElementById('save-json').addEventListener('click', () => this.saveJSON());
        document.getElementById('load-json').addEventListener('click', () => document.getElementById('load-json-input').click());
        document.getElementById('load-json-input').addEventListener('change', (e) => this.loadJSON(e));
        document.getElementById('clear-data').addEventListener('click', () => this.clearLocalStorage());

        // Export type radio
        document.querySelectorAll('input[name="export-type"]').forEach(r => {
            r.addEventListener('change', () => this.updateExportTypeUI());
        });

        // Keyboard
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closePointModal(); this.closePhotoViewer(); this.closeContactModal();
                this.isAddingPoint = false;
                document.getElementById('add-point-btn')?.classList.remove('active');
            }
        });
    }

    // =====================================================
    // TAB NAVIGATION
    // =====================================================
    switchTab(tabName) {
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        if (tabName === 'export') this.updateExportSummary();
        if (tabName === 'dashboard') this.updateDashboard();
        if (tabName === 'inspectie') this.renderInspectionsList();
        if (tabName === 'oplevering') this.renderHandoversList();
    }

    // =====================================================
    // PROJECT & CONTACTS
    // =====================================================
    setDefaultDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('survey-date').value = today;
        document.getElementById('insp-date').value = today;
        document.getElementById('ho-date').value = today;
    }

    saveProject(showConfirmation = true) {
        this.project = {
            name: document.getElementById('project-name').value, number: document.getElementById('project-number').value,
            client: document.getElementById('client-name').value, contactPerson: document.getElementById('contact-person').value,
            address: document.getElementById('street-address').value, postalCode: document.getElementById('postal-code').value,
            city: document.getElementById('city').value, surveyDate: document.getElementById('survey-date').value,
            surveyor: document.getElementById('surveyor').value, description: document.getElementById('project-description').value,
            notes: document.getElementById('project-notes').value
        };
        this.saveToLocalStorage();
        if (showConfirmation) this.saveJSON();
    }

    autoSaveProject() { clearTimeout(this._ast); this._ast = setTimeout(() => this.saveProject(false), 2000); }

    loadProjectForm() {
        const p = this.project;
        document.getElementById('project-name').value = p.name || '';
        document.getElementById('project-number').value = p.number || '';
        document.getElementById('client-name').value = p.client || '';
        document.getElementById('contact-person').value = p.contactPerson || '';
        document.getElementById('street-address').value = p.address || '';
        document.getElementById('postal-code').value = p.postalCode || '';
        document.getElementById('city').value = p.city || '';
        document.getElementById('survey-date').value = p.surveyDate || '';
        document.getElementById('surveyor').value = p.surveyor || '';
        document.getElementById('project-description').value = p.description || '';
        document.getElementById('project-notes').value = p.notes || '';
    }

    // Contacts
    renderContacts() {
        const c = document.getElementById('contacts-list');
        if (!this.contacts.length) { c.innerHTML = '<p class="empty-state" style="padding:1rem;">Nog geen contacten</p>'; return; }
        c.innerHTML = this.contacts.map(ct => `
            <div class="contact-card" onclick="app.openContactModal('${ct.id}')">
                <div class="contact-avatar">${(ct.name||'?')[0].toUpperCase()}</div>
                <div class="contact-card-info">
                    <h4>${this.esc(ct.name)}</h4>
                    <p>${this.esc(ct.role)} ${ct.company ? '- '+this.esc(ct.company) : ''}</p>
                </div>
            </div>
        `).join('');
        this.updateAssigneeDropdowns();
    }

    openContactModal(id = null) {
        const modal = document.getElementById('contact-modal');
        const title = document.getElementById('contact-modal-title');
        const delBtn = document.getElementById('delete-contact');
        if (id) {
            const ct = this.contacts.find(c => c.id === id);
            if (!ct) return;
            title.textContent = 'Contact Bewerken';
            document.getElementById('contact-id-input').value = ct.id;
            document.getElementById('contact-name-input').value = ct.name;
            document.getElementById('contact-role-input').value = ct.role;
            document.getElementById('contact-company-input').value = ct.company || '';
            document.getElementById('contact-email-input').value = ct.email || '';
            document.getElementById('contact-phone-input').value = ct.phone || '';
            delBtn.style.display = 'block';
        } else {
            title.textContent = 'Contact Toevoegen';
            document.getElementById('contact-id-input').value = '';
            document.getElementById('contact-name-input').value = '';
            document.getElementById('contact-role-input').value = 'Uitvoerder';
            document.getElementById('contact-company-input').value = '';
            document.getElementById('contact-email-input').value = '';
            document.getElementById('contact-phone-input').value = '';
            delBtn.style.display = 'none';
        }
        modal.classList.add('active');
    }

    closeContactModal() { document.getElementById('contact-modal').classList.remove('active'); }

    saveContact() {
        const name = document.getElementById('contact-name-input').value.trim();
        if (!name) { this.showNotification('Vul een naam in', 'error'); return; }
        const id = document.getElementById('contact-id-input').value || this.genId();
        const ct = { id, name, role: document.getElementById('contact-role-input').value,
            company: document.getElementById('contact-company-input').value,
            email: document.getElementById('contact-email-input').value,
            phone: document.getElementById('contact-phone-input').value };
        const idx = this.contacts.findIndex(c => c.id === id);
        if (idx !== -1) this.contacts[idx] = ct; else this.contacts.push(ct);
        this.renderContacts(); this.saveToLocalStorage(); this.closeContactModal();
        this.showNotification('Contact opgeslagen', 'success');
    }

    deleteContact() {
        const id = document.getElementById('contact-id-input').value;
        if (id && confirm('Contact verwijderen?')) {
            this.contacts = this.contacts.filter(c => c.id !== id);
            this.renderContacts(); this.saveToLocalStorage(); this.closeContactModal();
        }
    }

    updateAssigneeDropdowns() {
        const opts = '<option value="">-- Niemand --</option>' + this.contacts.map(c => `<option value="${c.name}">${this.esc(c.name)} (${c.role})</option>`).join('');
        document.getElementById('point-assigned').innerHTML = opts;
    }

    // =====================================================
    // FLOOR PLAN MANAGEMENT
    // =====================================================
    processFloorPlanFiles(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const r = new FileReader();
                r.onload = (e) => { this.floorPlans.push({ id:this.genId(), name:file.name.replace(/\.[^/.]+$/,''), data:e.target.result, type:file.type }); this.renderFloorPlansList(); this.updateFloorPlanSelector(); this.saveToLocalStorage(); };
                r.readAsDataURL(file);
            } else if (file.type === 'application/pdf') this.processPDFFile(file);
        });
    }

    async processPDFFile(file) {
        try {
            this.showNotification('PDF wordt verwerkt...', 'info');
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            const ab = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: ab }).promise;
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const vp = page.getViewport({ scale: 2 });
                const canvas = document.createElement('canvas');
                canvas.width = vp.width; canvas.height = vp.height;
                await page.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
                const bn = file.name.replace(/\.[^/.]+$/,'');
                this.floorPlans.push({ id:this.genId(), name: pdf.numPages > 1 ? `${bn} - Pagina ${i}` : bn, data:canvas.toDataURL('image/png'), type:'image/png', originalType:'application/pdf' });
            }
            this.renderFloorPlansList(); this.updateFloorPlanSelector(); this.saveToLocalStorage();
            this.showNotification(`PDF: ${pdf.numPages} pagina('s) toegevoegd!`, 'success');
        } catch(e) { console.error(e); this.showNotification('Fout bij PDF verwerking', 'error'); }
    }

    renderFloorPlansList() {
        document.getElementById('floor-plans-list').innerHTML = this.floorPlans.map(fp => `
            <div class="floor-plan-card"><div class="floor-plan-thumbnail-wrapper"><img src="${fp.data}" alt="${fp.name}" class="floor-plan-thumbnail">${fp.originalType === 'application/pdf' ? '<span class="pdf-badge">PDF</span>' : ''}</div>
            <div class="floor-plan-info"><input type="text" value="${this.esc(fp.name)}" onchange="app.updateFloorPlanName('${fp.id}', this.value)">
            <div class="floor-plan-actions"><button class="select-btn" onclick="app.selectFloorPlan('${fp.id}')">Selecteren</button><button class="delete-btn" onclick="app.deleteFloorPlan('${fp.id}')">Verwijderen</button></div></div></div>
        `).join('');
    }

    updateFloorPlanSelector() {
        const base = '<option value="">-- Kies een plattegrond --</option>' + this.floorPlans.map(fp => `<option value="${fp.id}">${this.esc(fp.name)}</option>`).join('');
        document.getElementById('active-floor').innerHTML = base;
        document.getElementById('insp-floor').innerHTML = '<option value="">-- Optioneel --</option>' + this.floorPlans.map(fp => `<option value="${fp.id}">${this.esc(fp.name)}</option>`).join('');
        if (this.activeFloorPlanId && this.floorPlans.find(fp => fp.id === this.activeFloorPlanId)) document.getElementById('active-floor').value = this.activeFloorPlanId;
    }

    updateFloorPlanName(id, name) { const fp = this.floorPlans.find(f => f.id === id); if (fp) { fp.name = name; this.updateFloorPlanSelector(); this.saveToLocalStorage(); } }
    deleteFloorPlan(id) { if (!confirm('Plattegrond verwijderen?')) return; this.floorPlans = this.floorPlans.filter(fp => fp.id !== id); this.tickets = this.tickets.filter(t => t.floorPlanId !== id); if (this.activeFloorPlanId === id) { this.activeFloorPlanId = null; this.clearCanvas(); } this.renderFloorPlansList(); this.updateFloorPlanSelector(); this.renderPointsList(); this.saveToLocalStorage(); }
    selectFloorPlan(id) { this.switchTab('opname'); document.getElementById('active-floor').value = id; this.setActiveFloorPlan(id); }

    setActiveFloorPlan(id) {
        this.activeFloorPlanId = id;
        const fp = this.floorPlans.find(f => f.id === id);
        if (fp) {
            const img = document.getElementById('floor-plan-image');
            img.src = fp.data;
            document.getElementById('floor-plan-wrapper').style.display = 'inline-block';
            document.getElementById('canvas-placeholder').style.display = 'none';
            img.onload = () => this.renderLocationPoints();
            this.renderLocationPoints(); this.renderPointsList();
        } else this.clearCanvas();
    }

    clearCanvas() {
        document.getElementById('floor-plan-image').src = '';
        document.getElementById('floor-plan-wrapper').style.display = 'none';
        document.getElementById('canvas-placeholder').style.display = 'block';
        document.getElementById('location-points').innerHTML = '';
        this.renderPointsList();
    }

    // =====================================================
    // TICKET MANAGEMENT
    // =====================================================
    toggleAddPointMode() {
        this.isAddingPoint = !this.isAddingPoint;
        document.getElementById('add-point-btn').classList.toggle('active', this.isAddingPoint);
        document.getElementById('floor-plan-wrapper').classList.toggle('adding-point', this.isAddingPoint);
    }

    handleCanvasClick(e) {
        if (!this.isAddingPoint || !this.activeFloorPlanId || e.target.closest('.location-point')) return;
        const img = document.getElementById('floor-plan-image');
        const r = img.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        if (x >= 0 && x <= 100 && y >= 0 && y <= 100) { this.openPointModal(null, x, y); this.toggleAddPointMode(); }
    }

    openPointModal(pointId = null, x = 0, y = 0) {
        const modal = document.getElementById('point-modal');
        const title = document.getElementById('modal-title');
        const delBtn = document.getElementById('delete-point');
        const commentsSection = document.getElementById('comments-section');
        this.currentPhotos = [];

        if (pointId) {
            const t = this.tickets.find(p => p.id === pointId);
            if (!t) return;
            title.textContent = 'Ticket Bewerken';
            document.getElementById('point-id').value = t.id;
            document.getElementById('point-label').value = t.label;
            document.getElementById('point-description').value = t.description || '';
            document.getElementById('point-category').value = t.category || 'Bouwkundig';
            document.getElementById('point-priority').value = t.priority || 'medium';
            document.getElementById('point-severity').value = t.severity || 'cosmetic';
            document.getElementById('point-status').value = t.status || 'open';
            document.getElementById('point-assigned').value = t.assignedTo || '';
            document.getElementById('point-deadline').value = t.deadline || '';
            document.getElementById('point-x').value = t.x;
            document.getElementById('point-y').value = t.y;
            this.currentPhotos = [...(t.photos || [])];
            delBtn.style.display = 'block';
            this.editingPointId = pointId;
            commentsSection.style.display = 'block';
            this.renderComments(t.comments || []);
        } else {
            title.textContent = 'Ticket Toevoegen';
            document.getElementById('point-id').value = '';
            document.getElementById('point-label').value = '';
            document.getElementById('point-description').value = '';
            document.getElementById('point-category').value = 'Bouwkundig';
            document.getElementById('point-priority').value = 'medium';
            document.getElementById('point-severity').value = 'cosmetic';
            document.getElementById('point-status').value = 'open';
            document.getElementById('point-assigned').value = '';
            document.getElementById('point-deadline').value = '';
            document.getElementById('point-x').value = x;
            document.getElementById('point-y').value = y;
            delBtn.style.display = 'none';
            this.editingPointId = null;
            commentsSection.style.display = 'none';
        }
        this.renderPhotoPreview();
        modal.classList.add('active');
        document.getElementById('point-label').focus();
    }

    closePointModal() { document.getElementById('point-modal').classList.remove('active'); this.currentPhotos = []; this.editingPointId = null; }

    savePoint() {
        const label = document.getElementById('point-label').value.trim();
        if (!label) { this.showNotification('Vul een label in', 'error'); return; }
        const existingTicket = this.editingPointId ? this.tickets.find(t => t.id === this.editingPointId) : null;
        const td = {
            id: document.getElementById('point-id').value || this.genId(),
            floorPlanId: this.activeFloorPlanId, label,
            description: document.getElementById('point-description').value,
            category: document.getElementById('point-category').value,
            priority: document.getElementById('point-priority').value,
            severity: document.getElementById('point-severity').value,
            status: document.getElementById('point-status').value,
            assignedTo: document.getElementById('point-assigned').value,
            deadline: document.getElementById('point-deadline').value,
            x: parseFloat(document.getElementById('point-x').value),
            y: parseFloat(document.getElementById('point-y').value),
            photos: [...this.currentPhotos],
            comments: existingTicket ? existingTicket.comments || [] : [],
            history: existingTicket ? existingTicket.history || [] : [],
            createdAt: existingTicket ? existingTicket.createdAt : new Date().toISOString()
        };
        if (this.editingPointId) {
            const idx = this.tickets.findIndex(p => p.id === this.editingPointId);
            if (idx !== -1) { td.history.push({ action:'Bewerkt', date:new Date().toISOString() }); this.tickets[idx] = td; }
        } else {
            td.history.push({ action:'Aangemaakt', date:new Date().toISOString() });
            this.tickets.push(td);
        }
        this.logActivity(`Ticket "${label}" ${this.editingPointId ? 'bewerkt' : 'aangemaakt'}`);
        this.renderLocationPoints(); this.renderPointsList(); this.saveToLocalStorage(); this.closePointModal();
        this.showNotification('Ticket opgeslagen!', 'success');
    }

    deletePoint() {
        if (this.editingPointId && confirm('Ticket verwijderen?')) {
            const t = this.tickets.find(p => p.id === this.editingPointId);
            this.tickets = this.tickets.filter(p => p.id !== this.editingPointId);
            this.logActivity(`Ticket "${t?.label}" verwijderd`);
            this.renderLocationPoints(); this.renderPointsList(); this.saveToLocalStorage(); this.closePointModal();
        }
    }

    addComment() {
        if (!this.editingPointId) return;
        const input = document.getElementById('new-comment');
        const text = input.value.trim();
        if (!text) return;
        const t = this.tickets.find(p => p.id === this.editingPointId);
        if (!t) return;
        if (!t.comments) t.comments = [];
        t.comments.push({ text, date: new Date().toISOString(), author: this.project.surveyor || 'Gebruiker' });
        input.value = '';
        this.renderComments(t.comments);
        this.saveToLocalStorage();
    }

    renderComments(comments) {
        const c = document.getElementById('comments-list');
        c.innerHTML = comments.map(cm => `
            <div class="comment-item"><div class="comment-meta">${this.esc(cm.author)} - ${new Date(cm.date).toLocaleString('nl-NL')}</div>${this.esc(cm.text)}</div>
        `).join('');
    }

    renderLocationPoints() {
        const container = document.getElementById('location-points');
        const pts = this.tickets.filter(p => p.floorPlanId === this.activeFloorPlanId);
        const colors = { open:'#D97706', assigned:'#2563EB', completed:'#16A34A', verified:'#71717A', archived:'#A1A1AA' };
        container.innerHTML = pts.map((p, i) => `
            <div class="location-point" style="left:${p.x}%;top:${p.y}%;" onclick="app.openPointModal('${p.id}')" title="${this.esc(p.label)}">
                <svg viewBox="0 0 24 24" fill="${colors[p.status]||'#D97706'}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                <span class="point-label">${i + 1}</span>
            </div>
        `).join('');
    }

    renderPointsList() {
        const container = document.getElementById('points-list');
        const fStatus = document.getElementById('filter-status').value;
        const fCat = document.getElementById('filter-category').value;
        const fPri = document.getElementById('filter-priority').value;
        let pts = this.tickets.filter(p => p.floorPlanId === this.activeFloorPlanId);
        if (fStatus) pts = pts.filter(p => p.status === fStatus);
        if (fCat) pts = pts.filter(p => p.category === fCat);
        if (fPri) pts = pts.filter(p => p.priority === fPri);
        document.getElementById('ticket-count').textContent = pts.length;
        if (!pts.length) { container.innerHTML = '<p class="empty-state">Geen tickets gevonden</p>'; return; }
        container.innerHTML = pts.map((p, i) => `
            <div class="point-item priority-${p.priority||'medium'}" onclick="app.openPointModal('${p.id}')">
                <div class="point-item-icon">${i + 1}</div>
                <div class="point-item-info"><h4>${this.esc(p.label)}</h4><p>${p.category||''} · ${p.photos?.length||0} foto's${p.assignedTo ? ' · '+this.esc(p.assignedTo) : ''}</p></div>
                <span class="status-badge status-${p.status||'open'}">${STATUS_LABELS[p.status]||'Open'}</span>
            </div>
        `).join('');
    }

    populateCategoryFilter() {
        document.getElementById('filter-category').innerHTML = '<option value="">Alle categorieën</option>' + CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('');
    }

    // =====================================================
    // PHOTO MANAGEMENT
    // =====================================================
    processPhotoFiles(files) {
        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;
            const r = new FileReader();
            r.onload = (e) => { this.currentPhotos.push({ id:this.genId(), data:e.target.result, name:file.name }); this.renderPhotoPreview(); };
            r.readAsDataURL(file);
        });
    }
    renderPhotoPreview() {
        document.getElementById('photo-preview').innerHTML = this.currentPhotos.map(p => `
            <div class="photo-thumb"><img src="${p.data}" alt="${p.name}" onclick="app.viewPhoto('${p.id}')"><button class="remove-photo" onclick="event.stopPropagation();app.removePhoto('${p.id}')">&times;</button></div>
        `).join('');
    }
    removePhoto(id) { this.currentPhotos = this.currentPhotos.filter(p => p.id !== id); this.renderPhotoPreview(); }
    viewPhoto(id) { const i = this.currentPhotos.findIndex(p => p.id === id); if (i !== -1) { this.currentPhotoIndex = i; this.showPhotoViewer(); } }
    showPhotoViewer() { const p = this.currentPhotos[this.currentPhotoIndex]; if (p) { document.getElementById('photo-viewer-image').src = p.data; document.getElementById('photo-viewer-caption').textContent = `${this.currentPhotoIndex+1} / ${this.currentPhotos.length}`; document.getElementById('photo-viewer-modal').classList.add('active'); } }
    closePhotoViewer() { document.getElementById('photo-viewer-modal').classList.remove('active'); }
    navigatePhoto(d) { this.currentPhotoIndex = (this.currentPhotoIndex + d + this.currentPhotos.length) % this.currentPhotos.length; this.showPhotoViewer(); }

    // =====================================================
    // CAMERA
    // =====================================================
    async openCamera() {
        this._cameraFacingMode = 'environment';
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: this._cameraFacingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
                audio: false
            });
            this._cameraStream = stream;
            const video = document.getElementById('camera-video');
            video.srcObject = stream;
            document.getElementById('camera-modal').classList.add('active');
        } catch (e) {
            console.error('Camera error:', e);
            this.showNotification('Camera niet beschikbaar. Controleer uw toestemming.', 'error');
        }
    }

    capturePhoto() {
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        this.currentPhotos.push({ id: this.genId(), data: dataUrl, name: `foto_${new Date().toISOString().slice(11,19).replace(/:/g,'')}.jpg` });
        this.renderPhotoPreview();
        this.showNotification('Foto vastgelegd!', 'success');
    }

    async switchCamera() {
        this.closeCamera(true);
        this._cameraFacingMode = this._cameraFacingMode === 'environment' ? 'user' : 'environment';
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: this._cameraFacingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
                audio: false
            });
            this._cameraStream = stream;
            document.getElementById('camera-video').srcObject = stream;
            document.getElementById('camera-modal').classList.add('active');
        } catch (e) {
            this.showNotification('Camera wisselen mislukt', 'error');
        }
    }

    closeCamera(keepModal = false) {
        if (this._cameraStream) {
            this._cameraStream.getTracks().forEach(t => t.stop());
            this._cameraStream = null;
        }
        if (!keepModal) document.getElementById('camera-modal').classList.remove('active');
    }

    // =====================================================
    // ZOOM
    // =====================================================
    zoom(d) { this.zoomLevel = Math.max(0.25, Math.min(4, this.zoomLevel + d)); document.getElementById('floor-plan-image').style.transform = `scale(${this.zoomLevel})`; }
    zoomFit() { this.zoomLevel = 1; document.getElementById('floor-plan-image').style.transform = 'scale(1)'; }

    // =====================================================
    // INSPECTIE MODULE
    // =====================================================
    showInspectionOverview() {
        document.getElementById('inspectie-overview').style.display = 'block';
        document.getElementById('inspectie-setup').style.display = 'none';
        document.getElementById('inspectie-execute').style.display = 'none';
        document.getElementById('inspectie-sign').style.display = 'none';
        this.renderInspectionsList();
    }

    showInspectionSetup() {
        document.getElementById('inspectie-overview').style.display = 'none';
        document.getElementById('inspectie-setup').style.display = 'block';
        document.getElementById('insp-template').innerHTML = '<option value="">-- Kies template --</option>' +
            this.checklistTemplates.map(t => `<option value="${t.id}">${this.esc(t.name)}</option>`).join('');
        document.getElementById('insp-inspector').value = this.project.surveyor || '';
    }

    showInspectionExecution() {
        document.getElementById('inspectie-setup').style.display = 'none';
        document.getElementById('inspectie-execute').style.display = 'block';
        document.getElementById('inspectie-sign').style.display = 'none';
    }

    startInspection() {
        const name = document.getElementById('insp-name').value.trim();
        if (!name) { this.showNotification('Vul een naam in', 'error'); return; }
        const type = document.getElementById('insp-type').value;
        const templateId = document.getElementById('insp-template').value;
        const template = this.checklistTemplates.find(t => t.id === templateId);
        const isNEN = template && template.scoring === 'nen2767';
        const items = type === 'checklist' && template ? template.items.map((q, i) => ({ id: `item_${i}`, question: q, result: '', score: null, notes: '', photos: [] })) :
            [{ id: 'item_0', question: 'Vrije observatie', result: '', score: null, notes: '', photos: [] }];

        const insp = {
            id: this.genId(), name, type, templateId: templateId || null,
            scoring: isNEN ? 'nen2767' : null,
            date: document.getElementById('insp-date').value, inspector: document.getElementById('insp-inspector').value,
            floorPlanId: document.getElementById('insp-floor').value || null,
            status: 'in_progress', items, signature: null, notes: ''
        };
        this.inspections.push(insp);
        this.currentInspectionId = insp.id;
        this.logActivity(`Inspectie "${name}" gestart`);
        this.saveToLocalStorage();
        this.renderChecklistExecution();
        this.showInspectionExecution();
    }

    renderChecklistExecution() {
        const insp = this.inspections.find(i => i.id === this.currentInspectionId);
        if (!insp) return;
        document.getElementById('insp-exec-title').textContent = insp.name;
        document.getElementById('insp-notes').value = insp.notes || '';
        const isNEN = insp.scoring === 'nen2767';
        const container = document.getElementById('checklist-items');
        container.innerHTML = insp.items.map((item, idx) => `
            <div class="checklist-item" data-idx="${idx}">
                <div style="flex:1">
                    <div class="checklist-item-question">${this.esc(item.question)}</div>
                    <div class="checklist-item-detail">
                        <textarea rows="1" placeholder="Notitie..." onchange="app.updateChecklistItem(${idx},'notes',this.value)">${this.esc(item.notes)}</textarea>
                    </div>
                </div>
                ${isNEN ? `
                <div class="checklist-item-actions nen-scores">
                    ${[1,2,3,4,5,6].map(s => `<button class="checklist-btn nen-score nen-score-${s} ${item.score==s?'selected':''}" onclick="app.updateChecklistItem(${idx},'score',${s})" title="${this.getNENLabel(s)}">${s}</button>`).join('')}
                </div>` : `
                <div class="checklist-item-actions">
                    <button class="checklist-btn pass ${item.result==='pass'?'selected':''}" onclick="app.updateChecklistItem(${idx},'result','pass')" title="Goed">&#10003;</button>
                    <button class="checklist-btn fail ${item.result==='fail'?'selected':''}" onclick="app.updateChecklistItem(${idx},'result','fail')" title="Fout">&#10007;</button>
                    <button class="checklist-btn na ${item.result==='na'?'selected':''}" onclick="app.updateChecklistItem(${idx},'result','na')" title="N.v.t.">-</button>
                </div>`}
            </div>
        `).join('');
        this.updateInspectionProgress();
    }

    getNENLabel(score) {
        return {1:'Uitstekend',2:'Goed',3:'Redelijk',4:'Matig',5:'Slecht',6:'Zeer slecht'}[score] || '';
    }

    updateChecklistItem(idx, field, value) {
        const insp = this.inspections.find(i => i.id === this.currentInspectionId);
        if (!insp) return;
        insp.items[idx][field] = value;
        if (field === 'result' || field === 'score') this.renderChecklistExecution();
        this.saveToLocalStorage();
    }

    updateInspectionProgress() {
        const insp = this.inspections.find(i => i.id === this.currentInspectionId);
        if (!insp) return;
        const isNEN = insp.scoring === 'nen2767';
        const done = isNEN ? insp.items.filter(i => i.score).length : insp.items.filter(i => i.result).length;
        const total = insp.items.length;
        let extra = '';
        if (isNEN && done > 0) {
            const scores = insp.items.filter(i => i.score).map(i => i.score);
            const avg = (scores.reduce((a,b) => a+b, 0) / scores.length).toFixed(1);
            extra = ` · Gem. ${avg} (${this.getNENLabel(Math.round(avg))})`;
        }
        document.getElementById('insp-progress-text').textContent = `${done} / ${total}${extra}`;
        document.getElementById('insp-progress-bar').style.width = total ? `${(done/total)*100}%` : '0%';
    }

    showSignature() {
        const insp = this.inspections.find(i => i.id === this.currentInspectionId);
        if (!insp) return;
        insp.notes = document.getElementById('insp-notes').value;
        // Create tickets for failed items
        insp.items.filter(i => i.result === 'fail').forEach(item => {
            const exists = this.tickets.some(t => t.label === `[Inspectie] ${item.question}` && t.floorPlanId === insp.floorPlanId);
            if (!exists && insp.floorPlanId) {
                this.tickets.push({
                    id: this.genId(), floorPlanId: insp.floorPlanId, label: `[Inspectie] ${item.question}`,
                    description: `Afgekeurd tijdens inspectie "${insp.name}"\n${item.notes||''}`,
                    category: 'Bouwkundig', priority: 'medium', severity: 'functional', status: 'open',
                    assignedTo: '', deadline: '', x: 50, y: 50, photos: [], comments: [], history: [{ action:'Aangemaakt vanuit inspectie', date:new Date().toISOString() }],
                    createdAt: new Date().toISOString()
                });
            }
        });
        this.saveToLocalStorage();
        document.getElementById('inspectie-execute').style.display = 'none';
        document.getElementById('inspectie-sign').style.display = 'block';
        document.getElementById('sign-name').value = insp.inspector || '';
        this.initSignatureCanvas('signature-canvas');
    }

    initSignatureCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let drawing = false;
        const getPos = (e) => {
            const r = canvas.getBoundingClientRect();
            const t = e.touches ? e.touches[0] : e;
            return { x: (t.clientX - r.left) * (canvas.width / r.width), y: (t.clientY - r.top) * (canvas.height / r.height) };
        };
        const start = (e) => { e.preventDefault(); drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
        const move = (e) => { if (!drawing) return; e.preventDefault(); const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.strokeStyle = '#36363E'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke(); };
        const end = () => { drawing = false; };
        canvas.onmousedown = start; canvas.onmousemove = move; canvas.onmouseup = end; canvas.onmouseleave = end;
        canvas.ontouchstart = start; canvas.ontouchmove = move; canvas.ontouchend = end;
    }

    clearSignatureCanvas() { const c = document.getElementById('signature-canvas'); c.getContext('2d').clearRect(0, 0, c.width, c.height); }

    signInspection() {
        const insp = this.inspections.find(i => i.id === this.currentInspectionId);
        if (!insp) return;
        const name = document.getElementById('sign-name').value.trim();
        if (!name) { this.showNotification('Vul uw naam in', 'error'); return; }
        insp.signature = { name, date: new Date().toISOString(), data: document.getElementById('signature-canvas').toDataURL() };
        insp.status = 'signed';
        this.logActivity(`Inspectie "${insp.name}" ondertekend door ${name}`);
        this.saveToLocalStorage();
        this.showNotification('Inspectie ondertekend en afgerond!', 'success');
        this.showInspectionOverview();
    }

    renderInspectionsList() {
        const c = document.getElementById('inspections-list');
        if (!this.inspections.length) { c.innerHTML = '<p class="empty-state">Nog geen inspecties uitgevoerd</p>'; return; }
        c.innerHTML = this.inspections.map(insp => {
            const isNEN = insp.scoring === 'nen2767';
            const done = isNEN ? insp.items.filter(i => i.score).length : insp.items.filter(i => i.result).length;
            const fail = insp.items.filter(i => i.result === 'fail').length;
            let extra = '';
            if (isNEN && done > 0) {
                const avg = (insp.items.filter(i => i.score).map(i => i.score).reduce((a,b)=>a+b,0) / done).toFixed(1);
                extra = ` · Gem. score: ${avg}`;
            } else if (fail) {
                extra = ` · ${fail} afgekeurd`;
            }
            const catLabel = insp.scoring === 'nen2767' ? ' · NEN 2767' : '';
            return `<div class="inspection-card" onclick="app.viewInspection('${insp.id}')">
                <div class="inspection-card-info"><h4>${this.esc(insp.name)}</h4><p>${insp.date} · ${insp.inspector||''}${catLabel} · ${done}/${insp.items.length} items${extra}</p></div>
                <span class="status-badge status-${insp.status==='signed'?'verified':'assigned'}">${insp.status==='signed'?'Ondertekend':'In uitvoering'}</span>
            </div>`;
        }).join('');
    }

    viewInspection(id) {
        this.currentInspectionId = id;
        const insp = this.inspections.find(i => i.id === id);
        if (!insp) return;
        if (insp.status === 'signed') {
            this.renderChecklistExecution();
            document.getElementById('inspectie-overview').style.display = 'none';
            document.getElementById('inspectie-execute').style.display = 'block';
            document.getElementById('finish-inspection-btn').style.display = 'none';
        } else {
            this.renderChecklistExecution();
            this.showInspectionExecution();
            document.getElementById('inspectie-overview').style.display = 'none';
            document.getElementById('finish-inspection-btn').style.display = '';
        }
    }

    // =====================================================
    // OPLEVERING MODULE
    // =====================================================
    showHandoverOverview() {
        document.getElementById('oplevering-overview').style.display = 'block';
        document.getElementById('oplevering-setup').style.display = 'none';
        document.getElementById('oplevering-execute').style.display = 'none';
        document.getElementById('oplevering-sign').style.display = 'none';
        this.renderHandoversList();
    }

    showHandoverSetup() {
        document.getElementById('oplevering-overview').style.display = 'none';
        document.getElementById('oplevering-setup').style.display = 'block';
        document.getElementById('ho-participants').innerHTML = '';
        this.addHandoverParticipant();
    }

    showHandoverExecution() {
        document.getElementById('oplevering-setup').style.display = 'none';
        document.getElementById('oplevering-execute').style.display = 'block';
        document.getElementById('oplevering-sign').style.display = 'none';
    }

    showHandoverSign() {
        document.getElementById('oplevering-execute').style.display = 'none';
        document.getElementById('oplevering-sign').style.display = 'block';
        document.getElementById('ho-signatures-area').innerHTML = '';
        const ho = this.handovers.find(h => h.id === this.currentHandoverId);
        if (ho && ho.participants) {
            ho.participants.forEach(p => this.addHandoverSignatureBlock(p.name, p.role));
        }
    }

    addHandoverParticipant() {
        const c = document.getElementById('ho-participants');
        const div = document.createElement('div');
        div.className = 'ho-participant-row';
        div.innerHTML = `<input type="text" placeholder="Naam"><select><option value="Opdrachtgever">Opdrachtgever</option><option value="Aannemer">Aannemer</option><option value="Projectleider">Projectleider</option><option value="Inspecteur">Inspecteur</option><option value="Overig">Overig</option></select><input type="text" placeholder="Bedrijf"><button class="remove-btn" onclick="this.parentElement.remove()">&times;</button>`;
        c.appendChild(div);
    }

    startHandover() {
        const type = document.getElementById('ho-type').value;
        const date = document.getElementById('ho-date').value;
        const notes = document.getElementById('ho-notes').value;
        const participantRows = document.querySelectorAll('#ho-participants .ho-participant-row');
        const participants = Array.from(participantRows).map(row => ({
            name: row.querySelector('input:first-child').value,
            role: row.querySelector('select').value,
            company: row.querySelectorAll('input')[1].value
        })).filter(p => p.name);

        const openTickets = this.tickets.filter(t => t.status !== 'verified' && t.status !== 'archived');
        const ho = {
            id: this.genId(), type, date, status: 'in_progress', participants, notes,
            items: openTickets.map(t => ({ ticketId: t.id, verdict: '', notes: '' })),
            signatures: [], verdict: '', documents: []
        };
        this.handovers.push(ho);
        this.currentHandoverId = ho.id;
        this.logActivity(`${HO_TYPE_LABELS[type]} gestart`);
        this.saveToLocalStorage();
        this.renderHandoverExecution();
        this.showHandoverExecution();
    }

    renderHandoverExecution() {
        const ho = this.handovers.find(h => h.id === this.currentHandoverId);
        if (!ho) return;
        document.getElementById('ho-exec-title').textContent = HO_TYPE_LABELS[ho.type] || 'Oplevering';
        const c = document.getElementById('ho-items-list');
        if (!ho.items.length) { c.innerHTML = '<p class="empty-state">Geen openstaande tickets</p>'; return; }
        c.innerHTML = ho.items.map((item, idx) => {
            const t = this.tickets.find(tk => tk.id === item.ticketId);
            if (!t) return '';
            return `<div class="ho-item">
                <div class="ho-item-info"><h4>${this.esc(t.label)}</h4><p>${t.category||''} · ${PRIORITY_LABELS[t.priority]||''} · ${SEVERITY_LABELS[t.severity]||''}</p></div>
                <div class="ho-item-verdict">
                    <button class="verdict-btn approved ${item.verdict==='approved'?'selected':''}" onclick="app.setHandoverVerdict(${idx},'approved')">&#10003;</button>
                    <button class="verdict-btn conditional ${item.verdict==='conditional'?'selected':''}" onclick="app.setHandoverVerdict(${idx},'conditional')">&#9888;</button>
                    <button class="verdict-btn rejected ${item.verdict==='rejected'?'selected':''}" onclick="app.setHandoverVerdict(${idx},'rejected')">&#10007;</button>
                </div>
            </div>`;
        }).join('');
        this.updateHandoverProgress();
        this.renderHandoverDocs();
    }

    setHandoverVerdict(idx, verdict) {
        const ho = this.handovers.find(h => h.id === this.currentHandoverId);
        if (!ho) return;
        ho.items[idx].verdict = ho.items[idx].verdict === verdict ? '' : verdict;
        this.saveToLocalStorage();
        this.renderHandoverExecution();
    }

    updateHandoverProgress() {
        const ho = this.handovers.find(h => h.id === this.currentHandoverId);
        if (!ho) return;
        const done = ho.items.filter(i => i.verdict).length;
        document.getElementById('ho-progress-text').textContent = `${done} / ${ho.items.length} beoordeeld`;
        document.getElementById('ho-progress-bar').style.width = ho.items.length ? `${(done/ho.items.length)*100}%` : '0%';
    }

    processHandoverDocs(files) {
        const ho = this.handovers.find(h => h.id === this.currentHandoverId);
        if (!ho) return;
        Array.from(files).forEach(file => {
            const r = new FileReader();
            r.onload = (e) => {
                ho.documents.push({ id: this.genId(), name: file.name, data: e.target.result, category: 'document' });
                this.saveToLocalStorage(); this.renderHandoverDocs();
            };
            r.readAsDataURL(file);
        });
    }

    renderHandoverDocs() {
        const ho = this.handovers.find(h => h.id === this.currentHandoverId);
        if (!ho) return;
        document.getElementById('ho-documents-list').innerHTML = ho.documents.map(d => `
            <div class="ho-doc-item"><span>${this.esc(d.name)}</span><button onclick="app.removeHandoverDoc('${d.id}')">&times;</button></div>
        `).join('');
    }

    removeHandoverDoc(docId) {
        const ho = this.handovers.find(h => h.id === this.currentHandoverId);
        if (ho) { ho.documents = ho.documents.filter(d => d.id !== docId); this.saveToLocalStorage(); this.renderHandoverDocs(); }
    }

    addHandoverSignatureBlock(name = '', role = '') {
        const area = document.getElementById('ho-signatures-area');
        const idx = area.children.length;
        const div = document.createElement('div');
        div.className = 'ho-signature-block';
        div.innerHTML = `<label>Naam</label><input type="text" class="ho-sig-name" value="${this.esc(name)}" placeholder="Volledige naam">
            <label>Rol</label><input type="text" class="ho-sig-role" value="${this.esc(role)}" placeholder="Rol">
            <label>Handtekening</label><canvas class="ho-sig-canvas" width="400" height="150"></canvas>
            <button class="btn btn-secondary" onclick="this.previousElementSibling.getContext('2d').clearRect(0,0,400,150)" style="margin-top:0.5rem;padding:4px 12px;font-size:0.8rem;">Wissen</button>`;
        area.appendChild(div);
        this.initSignatureCanvas2(div.querySelector('canvas'));
    }

    initSignatureCanvas2(canvas) {
        const ctx = canvas.getContext('2d');
        let drawing = false;
        const getPos = (e) => { const r = canvas.getBoundingClientRect(); const t = e.touches ? e.touches[0] : e; return { x:(t.clientX-r.left)*(canvas.width/r.width), y:(t.clientY-r.top)*(canvas.height/r.height) }; };
        const start = (e) => { e.preventDefault(); drawing = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
        const move = (e) => { if (!drawing) return; e.preventDefault(); const p = getPos(e); ctx.lineTo(p.x, p.y); ctx.strokeStyle='#36363E'; ctx.lineWidth=2; ctx.lineCap='round'; ctx.stroke(); };
        const end = () => { drawing = false; };
        canvas.onmousedown = start; canvas.onmousemove = move; canvas.onmouseup = end; canvas.onmouseleave = end;
        canvas.ontouchstart = start; canvas.ontouchmove = move; canvas.ontouchend = end;
    }

    signHandover() {
        const ho = this.handovers.find(h => h.id === this.currentHandoverId);
        if (!ho) return;
        ho.verdict = document.getElementById('ho-verdict').value;
        const blocks = document.querySelectorAll('#ho-signatures-area .ho-signature-block');
        ho.signatures = Array.from(blocks).map(b => ({
            name: b.querySelector('.ho-sig-name').value,
            role: b.querySelector('.ho-sig-role').value,
            date: new Date().toISOString(),
            data: b.querySelector('canvas').toDataURL()
        }));
        ho.status = 'completed';
        // Update ticket statuses based on verdict
        ho.items.forEach(item => {
            const t = this.tickets.find(tk => tk.id === item.ticketId);
            if (t && item.verdict === 'approved') t.status = 'verified';
        });
        this.logActivity(`${HO_TYPE_LABELS[ho.type]} afgerond: ${ho.verdict === 'approved' ? 'Goedgekeurd' : ho.verdict === 'conditional' ? 'Onder voorbehoud' : 'Afgekeurd'}`);
        this.saveToLocalStorage();
        this.showNotification('Oplevering ondertekend!', 'success');
        this.showHandoverOverview();
    }

    renderHandoversList() {
        const c = document.getElementById('handovers-list');
        if (!this.handovers.length) { c.innerHTML = '<p class="empty-state">Nog geen opleveringen</p>'; return; }
        c.innerHTML = this.handovers.map(ho => {
            const approved = ho.items.filter(i => i.verdict === 'approved').length;
            return `<div class="handover-card" onclick="app.viewHandover('${ho.id}')">
                <div class="handover-card-info"><h4>${HO_TYPE_LABELS[ho.type]||ho.type}</h4><p>${ho.date} · ${ho.items.length} punten · ${approved} goedgekeurd</p></div>
                <span class="status-badge status-${ho.status==='completed'?'verified':'assigned'}">${ho.status==='completed'?'Afgerond':'In uitvoering'}</span>
            </div>`;
        }).join('');
    }

    viewHandover(id) {
        this.currentHandoverId = id;
        this.renderHandoverExecution();
        document.getElementById('oplevering-overview').style.display = 'none';
        document.getElementById('oplevering-execute').style.display = 'block';
        const ho = this.handovers.find(h => h.id === id);
        document.getElementById('finish-handover-btn').style.display = ho && ho.status === 'completed' ? 'none' : '';
    }

    // =====================================================
    // DASHBOARD
    // =====================================================
    updateDashboard() {
        const tickets = this.tickets;
        const today = new Date().toISOString().split('T')[0];
        const open = tickets.filter(t => t.status === 'open').length;
        const assigned = tickets.filter(t => t.status === 'assigned').length;
        const completed = tickets.filter(t => t.status === 'completed' || t.status === 'verified').length;
        const overdue = tickets.filter(t => t.deadline && t.deadline < today && t.status !== 'verified' && t.status !== 'archived').length;

        document.querySelector('#stat-total .stat-number').textContent = tickets.length;
        document.querySelector('#stat-open .stat-number').textContent = open;
        document.querySelector('#stat-assigned .stat-number').textContent = assigned;
        document.querySelector('#stat-completed .stat-number').textContent = completed;
        document.querySelector('#stat-overdue .stat-number').textContent = overdue;
        document.querySelector('#stat-inspections .stat-number').textContent = this.inspections.length;

        // Status chart
        const statusData = [
            { label: 'Open', count: open, color: '#D97706' },
            { label: 'Toegewezen', count: assigned, color: '#2563EB' },
            { label: 'Afgerond', count: completed, color: '#16A34A' },
            { label: 'Verlopen', count: overdue, color: '#DC2626' }
        ];
        this.renderBarChart('chart-status', statusData);

        // Category chart
        const catCounts = {};
        tickets.forEach(t => { catCounts[t.category||'Overig'] = (catCounts[t.category||'Overig']||0) + 1; });
        const catData = Object.entries(catCounts).map(([label, count]) => ({ label, count, color: '#D97706' })).sort((a,b) => b.count - a.count);
        this.renderBarChart('chart-category', catData);

        // Assignee chart
        const assignCounts = {};
        tickets.filter(t => t.assignedTo).forEach(t => { assignCounts[t.assignedTo] = (assignCounts[t.assignedTo]||0) + 1; });
        const assignData = Object.entries(assignCounts).map(([label, count]) => ({ label, count, color: '#2563EB' })).sort((a,b) => b.count - a.count);
        this.renderBarChart('chart-assignee', assignData.length ? assignData : [{ label: 'Geen toewijzingen', count: 0, color: '#A1A1AA' }]);

        // Activity log
        const logC = document.getElementById('activity-log');
        if (!this.activityLog.length) { logC.innerHTML = '<p class="empty-state">Nog geen activiteit</p>'; return; }
        logC.innerHTML = this.activityLog.slice(-20).reverse().map(a => `
            <div class="activity-item"><span class="activity-time">${new Date(a.date).toLocaleString('nl-NL',{hour:'2-digit',minute:'2-digit',day:'numeric',month:'short'})}</span><span>${this.esc(a.text)}</span></div>
        `).join('');
    }

    renderBarChart(containerId, data) {
        const max = Math.max(...data.map(d => d.count), 1);
        document.getElementById(containerId).innerHTML = data.map(d => `
            <div class="chart-bar-row"><span class="chart-bar-label">${this.esc(d.label)}</span>
            <div class="chart-bar-track"><div class="chart-bar-fill" style="width:${(d.count/max)*100}%;background:${d.color}"></div></div>
            <span class="chart-bar-count">${d.count}</span></div>
        `).join('');
    }

    logActivity(text) { this.activityLog.push({ text, date: new Date().toISOString() }); if (this.activityLog.length > 100) this.activityLog = this.activityLog.slice(-100); }

    // =====================================================
    // EXPORT
    // =====================================================
    updateExportTypeUI() {
        const type = document.querySelector('input[name="export-type"]:checked').value;
        document.getElementById('export-inspection-select').style.display = type === 'inspection' ? 'block' : 'none';
        document.getElementById('export-handover-select').style.display = type === 'handover' ? 'block' : 'none';
        if (type === 'inspection') {
            document.getElementById('export-inspection-id').innerHTML = this.inspections.map(i => `<option value="${i.id}">${this.esc(i.name)} (${i.date})</option>`).join('');
        }
        if (type === 'handover') {
            document.getElementById('export-handover-id').innerHTML = this.handovers.map(h => `<option value="${h.id}">${HO_TYPE_LABELS[h.type]} (${h.date})</option>`).join('');
        }
    }

    updateExportSummary() {
        const totalPhotos = this.tickets.reduce((a, p) => a + (p.photos?.length || 0), 0);
        const s = document.getElementById('export-summary');
        if (!this.project.name && !this.tickets.length) { s.innerHTML = '<p>Vul eerst projectgegevens in.</p>'; return; }
        s.innerHTML = `
            <div class="summary-item"><h4>Project</h4><p>${this.project.name || 'Niet ingevuld'}</p></div>
            <div class="summary-item"><h4>Adres</h4><p>${this.project.address || 'Niet ingevuld'}</p></div>
            <div class="summary-item"><h4>Plattegronden</h4><p>${this.floorPlans.length}</p></div>
            <div class="summary-item"><h4>Tickets</h4><p>${this.tickets.length}</p></div>
            <div class="summary-item"><h4>Foto's</h4><p>${totalPhotos}</p></div>
            <div class="summary-item"><h4>Inspecties</h4><p>${this.inspections.length}</p></div>
            <div class="summary-item"><h4>Opleveringen</h4><p>${this.handovers.length}</p></div>`;
        this.updateExportTypeUI();
    }

    async exportHTML() {
        const type = document.querySelector('input[name="export-type"]:checked').value;
        let html;
        if (type === 'handover') {
            const hoId = document.getElementById('export-handover-id').value;
            html = this.generateHandoverReport(hoId);
        } else {
            html = this.generateFullReport();
        }
        const blob = new Blob([html], { type: 'text/html' });
        const filename = `${this.project.name || 'rapport'}_${type}.html`;
        await this.saveWithPicker(blob, filename, [{ description: 'HTML bestanden', accept: { 'text/html': ['.html'] } }]);
    }

    generateFullReport() {
        const incPhotos = document.getElementById('include-photos').checked;
        const incMap = document.getElementById('include-map').checked;
        const byFloor = {};
        this.tickets.forEach(t => { if (!byFloor[t.floorPlanId]) byFloor[t.floorPlanId] = []; byFloor[t.floorPlanId].push(t); });

        return `<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${this.esc(this.project.name||'Rapport')} - Open Field Studio</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>:root{--amber:#D97706;--night:#2A2A32;--bg:#FAFAF9;--surface:#fff;--border:#E7E5E4;--gray:#A1A1AA;}*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Inter',sans-serif;background:var(--bg);color:var(--night);line-height:1.6;}.container{max-width:1100px;margin:0 auto;padding:2rem;}header{background:var(--night);padding:1.5rem 0;}header .container{display:flex;align-items:center;justify-content:space-between;}header h1{font-family:'Space Grotesk',sans-serif;color:#fff;font-size:1.5rem;}header span{color:var(--gray);}.section{background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:2rem;margin-bottom:2rem;}.section h3{font-family:'Space Grotesk',sans-serif;font-size:1.5rem;margin-bottom:1rem;border-bottom:2px solid var(--border);padding-bottom:0.5rem;}.meta{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;}.meta-item{padding:0.75rem;background:var(--bg);border-radius:8px;}.meta-item label{display:block;font-size:0.75rem;color:var(--gray);}.meta-item span{font-weight:500;}.ticket-card{border:1px solid var(--border);border-radius:8px;padding:1rem;margin-bottom:1rem;}.ticket-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.5rem;}.ticket-badge{padding:0.15em 0.5em;border-radius:999px;font-size:0.7rem;font-weight:600;}.tb-open{background:rgba(217,119,6,0.15);color:#B45309;}.tb-assigned{background:rgba(37,99,235,0.15);color:#1D4ED8;}.tb-completed{background:rgba(22,163,74,0.15);color:#15803D;}.tb-verified{background:rgba(161,161,170,0.15);color:#71717A;}.photos-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:0.5rem;margin-top:0.5rem;}.photos-grid img{width:100%;aspect-ratio:1;object-fit:cover;border-radius:6px;border:1px solid var(--border);}footer{text-align:center;padding:2rem;color:var(--gray);font-size:0.8rem;}@media print{.section{break-inside:avoid;}}</style></head><body>
<header><div class="container"><h1>Open Field Studio</h1><span>${new Date().toLocaleDateString('nl-NL')}</span></div></header>
<main class="container"><div class="section"><h2 style="font-family:'Space Grotesk';font-size:2rem;margin-bottom:1rem;">${this.esc(this.project.name||'Projectrapport')}</h2><div class="meta">
${this.project.number?`<div class="meta-item"><label>Projectnummer</label><span>${this.esc(this.project.number)}</span></div>`:''}
<div class="meta-item"><label>Adres</label><span>${this.esc(this.project.address)}, ${this.esc(this.project.postalCode)} ${this.esc(this.project.city)}</span></div>
${this.project.client?`<div class="meta-item"><label>Opdrachtgever</label><span>${this.esc(this.project.client)}</span></div>`:''}
${this.project.surveyDate?`<div class="meta-item"><label>Opnamedatum</label><span>${this.esc(this.project.surveyDate)}</span></div>`:''}
${this.project.surveyor?`<div class="meta-item"><label>Opgenomen door</label><span>${this.esc(this.project.surveyor)}</span></div>`:''}
</div>${this.project.description?`<p style="margin-top:1rem;color:var(--gray);">${this.esc(this.project.description)}</p>`:''}</div>
${this.floorPlans.map(fp => {
    const pts = byFloor[fp.id] || [];
    return `<div class="section"><h3>${this.esc(fp.name)}</h3>
    ${incMap?`<div style="position:relative;display:inline-block;max-width:100%;margin-bottom:1rem;"><img src="${fp.data}" style="max-width:100%;border-radius:8px;border:1px solid var(--border);">
    ${pts.map((p,i)=>`<div style="position:absolute;left:${p.x}%;top:${p.y}%;width:24px;height:24px;transform:translate(-50%,-100%);"><svg viewBox="0 0 24 24" fill="${{open:'#D97706',assigned:'#2563EB',completed:'#16A34A',verified:'#71717A'}[p.status]||'#D97706'}"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/></svg></div>`).join('')}
    </div>`:''}
    ${pts.length?pts.map((p,i)=>`<div class="ticket-card"><div class="ticket-header"><strong>${i+1}. ${this.esc(p.label)}</strong><span class="ticket-badge tb-${p.status}">${STATUS_LABELS[p.status]||'Open'}</span></div>
    <p style="font-size:0.8rem;color:var(--gray);">${p.category||''} · ${PRIORITY_LABELS[p.priority]||''} · ${SEVERITY_LABELS[p.severity]||''}${p.assignedTo?' · '+this.esc(p.assignedTo):''}${p.deadline?' · Deadline: '+p.deadline:''}</p>
    ${p.description?`<p style="margin-top:0.5rem;">${this.esc(p.description)}</p>`:''}
    ${incPhotos&&p.photos?.length?`<div class="photos-grid">${p.photos.map(ph=>`<img src="${ph.data}">`).join('')}</div>`:''}
    </div>`).join(''):'<p style="color:var(--gray);">Geen tickets</p>'}
    </div>`;
}).join('')}
</main><footer><p>Gegenereerd met Open Field Studio op ${new Date().toLocaleString('nl-NL')}</p></footer></body></html>`;
    }

    generateHandoverReport(hoId) {
        const ho = this.handovers.find(h => h.id === hoId);
        if (!ho) return this.generateFullReport();
        return `<!DOCTYPE html><html lang="nl"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Proces-Verbaal van Oplevering - ${this.esc(this.project.name)}</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
<style>*{box-sizing:border-box;margin:0;padding:0;}body{font-family:'Inter',sans-serif;color:#36363E;line-height:1.6;padding:2rem;max-width:900px;margin:0 auto;}h1{font-family:'Space Grotesk',sans-serif;font-size:1.8rem;margin-bottom:0.5rem;}h2{font-family:'Space Grotesk',sans-serif;font-size:1.3rem;margin:1.5rem 0 0.75rem;border-bottom:2px solid #E7E5E4;padding-bottom:0.5rem;}.meta-grid{display:grid;grid-template-columns:1fr 1fr;gap:0.5rem;margin-bottom:1.5rem;}.meta-row{display:flex;gap:0.5rem;}.meta-label{font-weight:600;min-width:140px;font-size:0.85rem;color:#A1A1AA;}.meta-val{font-size:0.85rem;}table{width:100%;border-collapse:collapse;margin:1rem 0;}th,td{border:1px solid #E7E5E4;padding:0.5rem 0.75rem;text-align:left;font-size:0.85rem;}th{background:#F5F5F4;font-weight:600;}.verdict-ok{color:#16A34A;font-weight:600;}.verdict-cond{color:#F59E0B;font-weight:600;}.verdict-nok{color:#DC2626;font-weight:600;}.sig-block{display:inline-block;width:45%;margin:1rem 2%;vertical-align:top;}.sig-block img{max-width:100%;border:1px solid #E7E5E4;border-radius:4px;}@media print{body{padding:1rem;}}</style></head><body>
<h1>Proces-Verbaal van Oplevering</h1>
<p style="color:#A1A1AA;margin-bottom:2rem;">${HO_TYPE_LABELS[ho.type]} · ${ho.date}</p>
<h2>Projectgegevens</h2>
<div class="meta-grid">
<div class="meta-row"><span class="meta-label">Project:</span><span class="meta-val">${this.esc(this.project.name)}</span></div>
<div class="meta-row"><span class="meta-label">Projectnummer:</span><span class="meta-val">${this.esc(this.project.number)}</span></div>
<div class="meta-row"><span class="meta-label">Adres:</span><span class="meta-val">${this.esc(this.project.address)}, ${this.esc(this.project.postalCode)} ${this.esc(this.project.city)}</span></div>
<div class="meta-row"><span class="meta-label">Opdrachtgever:</span><span class="meta-val">${this.esc(this.project.client)}</span></div>
<div class="meta-row"><span class="meta-label">Datum oplevering:</span><span class="meta-val">${ho.date}</span></div>
</div>
<h2>Deelnemers</h2>
<table><tr><th>Naam</th><th>Rol</th><th>Bedrijf</th></tr>
${(ho.participants||[]).map(p=>`<tr><td>${this.esc(p.name)}</td><td>${this.esc(p.role)}</td><td>${this.esc(p.company||'')}</td></tr>`).join('')}
</table>
<h2>Opleverpunten</h2>
<table><tr><th>#</th><th>Punt</th><th>Categorie</th><th>Prioriteit</th><th>Oordeel</th></tr>
${ho.items.map((item,i)=>{const t=this.tickets.find(tk=>tk.id===item.ticketId);if(!t)return'';const vc=item.verdict==='approved'?'verdict-ok':item.verdict==='conditional'?'verdict-cond':'verdict-nok';const vl=item.verdict==='approved'?'Goedgekeurd':item.verdict==='conditional'?'Onder voorbehoud':item.verdict==='rejected'?'Afgekeurd':'Niet beoordeeld';return`<tr><td>${i+1}</td><td>${this.esc(t.label)}</td><td>${t.category||''}</td><td>${PRIORITY_LABELS[t.priority]||''}</td><td class="${vc}">${vl}</td></tr>`;}).join('')}
</table>
<h2>Eindoordeel</h2>
<p style="font-size:1.2rem;font-weight:700;color:${ho.verdict==='approved'?'#16A34A':ho.verdict==='conditional'?'#F59E0B':'#DC2626'}">${ho.verdict==='approved'?'GOEDGEKEURD':ho.verdict==='conditional'?'GOEDGEKEURD ONDER VOORBEHOUD':'AFGEKEURD'}</p>
${ho.notes?`<p style="margin-top:0.5rem;">${this.esc(ho.notes)}</p>`:''}
<h2>Handtekeningen</h2>
${(ho.signatures||[]).map(s=>`<div class="sig-block"><p><strong>${this.esc(s.name)}</strong> (${this.esc(s.role)})</p><p style="font-size:0.8rem;color:#A1A1AA;">${new Date(s.date).toLocaleString('nl-NL')}</p><img src="${s.data}" alt="Handtekening"></div>`).join('')}
<hr style="margin:2rem 0;border:none;border-top:1px solid #E7E5E4;">
<p style="text-align:center;font-size:0.75rem;color:#A1A1AA;">Gegenereerd met Open Field Studio op ${new Date().toLocaleString('nl-NL')}</p>
</body></html>`;
    }

    // =====================================================
    // SAVE/LOAD
    // =====================================================
    async saveJSON() {
        const data = { version:'2.0', exportDate:new Date().toISOString(), project:this.project, contacts:this.contacts, floorPlans:this.floorPlans, tickets:this.tickets, inspections:this.inspections, handovers:this.handovers, checklistTemplates:this.checklistTemplates, activityLog:this.activityLog };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type:'application/json' });
        const filename = `${this.project.name||'project'}_ofs.json`;
        await this.saveWithPicker(blob, filename, [{ description: 'JSON bestanden', accept: { 'application/json': ['.json'] } }]);
    }

    loadJSON(e) {
        const file = e.target.files[0]; if (!file) return;
        const r = new FileReader();
        r.onload = (ev) => {
            try {
                const d = JSON.parse(ev.target.result);
                if (d.project) this.project = d.project;
                if (d.contacts) this.contacts = d.contacts;
                if (d.floorPlans) this.floorPlans = d.floorPlans;
                // Support v1 locationPoints
                if (d.locationPoints) this.tickets = d.locationPoints;
                if (d.tickets) this.tickets = d.tickets;
                if (d.inspections) this.inspections = d.inspections;
                if (d.handovers) this.handovers = d.handovers;
                if (d.checklistTemplates) this.checklistTemplates = d.checklistTemplates;
                if (d.activityLog) this.activityLog = d.activityLog;
                this.loadProjectForm(); this.renderContacts(); this.renderFloorPlansList(); this.updateFloorPlanSelector(); this.saveToLocalStorage();
                this.showNotification('Project geladen!', 'success');
            } catch(err) { this.showNotification('Fout bij laden', 'error'); console.error(err); }
        };
        r.readAsText(file); e.target.value = '';
    }

    saveToLocalStorage() {
        localStorage.setItem('openFieldStudio', JSON.stringify({
            project:this.project, contacts:this.contacts, floorPlans:this.floorPlans, tickets:this.tickets,
            inspections:this.inspections, handovers:this.handovers, checklistTemplates:this.checklistTemplates, activityLog:this.activityLog
        }));
    }

    loadFromLocalStorage() {
        try {
            const saved = localStorage.getItem('openFieldStudio');
            if (!saved) return;
            const d = JSON.parse(saved);
            this.project = d.project || this.project;
            this.contacts = d.contacts || [];
            this.floorPlans = (d.floorPlans || []).filter(fp => fp.data && fp.data.startsWith('data:image'));
            this.tickets = d.tickets || d.locationPoints || [];
            this.inspections = d.inspections || [];
            this.handovers = d.handovers || [];
            // Merge saved templates with defaults: remove old split energie templates, add new defaults
            if (d.checklistTemplates?.length) {
                const obsolete = ['tpl_energie_schil','tpl_energie_installatie','tpl_energie_woning'];
                const cleaned = d.checklistTemplates.filter(t => !obsolete.includes(t.id));
                const savedIds = cleaned.map(t => t.id);
                const defaults = this.getDefaultTemplates();
                const newDefaults = defaults.filter(t => !savedIds.includes(t.id));
                this.checklistTemplates = [...cleaned, ...newDefaults];
            }
            this.activityLog = d.activityLog || [];
            this.loadProjectForm(); this.renderContacts(); this.renderFloorPlansList(); this.updateFloorPlanSelector();
        } catch(err) { console.error('localStorage load error:', err); localStorage.removeItem('openFieldStudio'); }
    }

    clearLocalStorage() {
        if (!confirm('Alle data wissen? Dit kan niet ongedaan worden.')) return;
        localStorage.removeItem('openFieldStudio');
        this.project = { name:'',number:'',client:'',contactPerson:'',address:'',postalCode:'',city:'',surveyDate:'',surveyor:'',description:'',notes:'' };
        this.contacts = []; this.floorPlans = []; this.tickets = []; this.inspections = []; this.handovers = []; this.activityLog = [];
        this.activeFloorPlanId = null;
        this.loadProjectForm(); this.renderContacts(); this.renderFloorPlansList(); this.updateFloorPlanSelector(); this.clearCanvas(); this.setDefaultDate();
        this.showNotification('Alle data gewist!', 'success');
    }

    validateAndCleanData() {
        let dirty = false;
        const valid = this.floorPlans.filter(fp => { if (!fp.data || typeof fp.data !== 'string' || !fp.data.startsWith('data:image/')) { dirty = true; return false; } const b = fp.data.split(',')[1]; if (!b || b.length < 100) { dirty = true; return false; } return true; });
        if (dirty) { this.floorPlans = valid; const ids = valid.map(fp => fp.id); this.tickets = this.tickets.filter(t => ids.includes(t.floorPlanId)); this.renderFloorPlansList(); this.updateFloorPlanSelector(); this.saveToLocalStorage(); setTimeout(() => this.showNotification('Corrupte data opgeschoond', 'error'), 500); }
    }

    // =====================================================
    // UTILITIES
    // =====================================================
    genId() { return 'id_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now(); }
    esc(text) { if (!text) return ''; const d = document.createElement('div'); d.textContent = text; return d.innerHTML; }

    async saveWithPicker(blob, filename, fileTypes) {
        // Try File System Access API (opslaglocatie kiezen)
        if (window.showSaveFilePicker) {
            try {
                const handle = await window.showSaveFilePicker({ suggestedName: filename, types: fileTypes });
                const writable = await handle.createWritable();
                await writable.write(blob);
                await writable.close();
                this.showNotification('Bestand opgeslagen!', 'success');
                return;
            } catch (e) {
                if (e.name === 'AbortError') return; // Gebruiker annuleerde
            }
        }
        // Fallback: directe download
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href = url; a.download = filename;
        a.click(); URL.revokeObjectURL(url);
        this.showNotification('Bestand gedownload!', 'success');
    }

    showNotification(msg, type = 'info') {
        const n = document.createElement('div');
        n.style.cssText = `position:fixed;bottom:2rem;right:2rem;padding:1rem 1.5rem;background:${type==='success'?'#16A34A':type==='error'?'#DC2626':'#D97706'};color:#fff;border-radius:8px;font-family:'Inter',sans-serif;font-weight:600;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:9999;animation:slideIn 0.3s ease;`;
        n.textContent = msg; document.body.appendChild(n);
        setTimeout(() => { n.style.animation = 'fadeOut 0.3s ease'; setTimeout(() => n.remove(), 300); }, 3000);
    }
}

// Animations
const style = document.createElement('style');
style.textContent = `@keyframes slideIn{from{transform:translateX(100px);opacity:0}to{transform:translateX(0);opacity:1}}@keyframes fadeOut{from{opacity:1}to{opacity:0}}`;
document.head.appendChild(style);

// Register Service Worker for PWA / offline
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
}

// Initialize
const app = new OpenFieldStudio();
