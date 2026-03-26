// =====================================================
// Open Field Studio - Translations (NL/EN/DE/FR)
// =====================================================

const LANG = {

// ==================== NEDERLANDS ====================
nl: {
    // Nav
    nav_project:'Project', nav_plans:'Plattegronden', nav_opname:'Opname', nav_inspectie:'Inspectie',
    nav_oplevering:'Oplevering', nav_dashboard:'Dashboard', nav_export:'Export', nav_handleiding:'Handleiding',

    // Project
    h_project:'Projectgegevens', lbl_name:'Projectnaam *', lbl_number:'Projectnummer', lbl_client:'Opdrachtgever',
    lbl_contact:'Contactpersoon', lbl_address:'Straat en huisnummer *', lbl_postal:'Postcode *', lbl_city:'Plaats *',
    lbl_date:'Opnamedatum', lbl_surveyor:'Opgenomen door', lbl_description:'Projectomschrijving', lbl_notes:'Opmerkingen',
    ph_name:'Bijv. Renovatie Kantoorpand', ph_number:'Bijv. 2024-001', ph_client:'Naam opdrachtgever',
    ph_contact:'Naam contactpersoon', ph_address:'Bijv. Hoofdstraat 123', ph_postal:'1234 AB', ph_city:'Amsterdam',
    ph_surveyor:'Uw naam', ph_description:'Korte beschrijving van het project...', ph_notes:'Aanvullende opmerkingen...',
    btn_save_project:'Project Opslaan', h_contacts:'Contacten', btn_add_contact:'+ Contact toevoegen',
    empty_contacts:'Nog geen contacten',

    // Contact modal
    contact_add:'Contact Toevoegen', contact_edit:'Contact Bewerken', lbl_contact_name:'Naam *',
    lbl_contact_role:'Rol', lbl_contact_company:'Bedrijf', lbl_contact_email:'E-mail', lbl_contact_phone:'Telefoon',
    ph_contact_name:'Volledige naam', ph_contact_company:'Bedrijfsnaam', ph_contact_email:'email@voorbeeld.nl', ph_contact_phone:'06-12345678',

    // Roles
    role_projectleider:'Projectleider', role_inspecteur:'Inspecteur', role_uitvoerder:'Uitvoerder',
    role_onderaannemer:'Onderaannemer', role_opdrachtgever:'Opdrachtgever', role_kwaliteitsborger:'Kwaliteitsborger', role_overig:'Overig',

    // Plans
    h_plans:'Plattegronden', upload_text:'Sleep plattegronden hierheen of klik om te uploaden', upload_hint:'JPG, PNG, PDF',
    btn_select:'Selecteren', btn_delete:'Verwijderen',

    // Opname
    lbl_select_plan:'Plattegrond:', ph_select_plan:'-- Kies een plattegrond --',
    filter_all_status:'Alle statussen', filter_all_cat:'Alle categorieën', filter_all_pri:'Alle prioriteiten',
    btn_add_ticket:'Ticket toevoegen', placeholder_canvas:'Selecteer een plattegrond om tickets toe te voegen',
    h_tickets:'Tickets', empty_tickets:'Nog geen tickets toegevoegd', empty_filtered:'Geen tickets gevonden',

    // Ticket modal
    ticket_add:'Ticket Toevoegen', ticket_edit:'Ticket Bewerken', lbl_label:'Label *', lbl_category:'Categorie',
    lbl_priority:'Prioriteit', lbl_severity:'Ernst', lbl_status:'Status', lbl_assigned:'Toegewezen aan',
    lbl_deadline:'Deadline', lbl_desc:'Beschrijving', lbl_photos:'Foto\'s',
    ph_label:'Bijv. Scheur in wand', ph_desc:'Beschrijving van het gebrek...', ph_nobody:'-- Niemand --',
    upload_photos:'Sleep foto\'s hierheen of klik om te uploaden', btn_camera:'Maak foto met camera',
    lbl_comments:'Commentaar', ph_comment:'Commentaar toevoegen...', btn_send:'Verstuur',
    btn_cancel:'Annuleren', btn_remove:'Verwijderen', btn_save:'Opslaan',

    // Categories
    cat_bouwkundig:'Bouwkundig', cat_schilderwerk:'Schilderwerk & afwerking', cat_sanitair:'Sanitair & leidingwerk',
    cat_elektra:'Elektra & verlichting', cat_hvac:'HVAC / klimaat', cat_dakwerk:'Dakwerk',
    cat_kozijnen:'Kozijnen & beglazing', cat_vloeren:'Vloeren & tegels', cat_buitenruimte:'Buitenruimte',
    cat_veiligheid:'Veiligheid', cat_overig:'Overig',

    // Status
    status_open:'Open', status_assigned:'Toegewezen', status_completed:'Afgerond',
    status_verified:'Geverifieerd', status_archived:'Gearchiveerd',

    // Priority
    pri_high:'Hoog', pri_medium:'Midden', pri_low:'Laag',

    // Severity
    sev_cosmetic:'Cosmetisch', sev_functional:'Functioneel', sev_safety:'Veiligheid', sev_structural:'Structureel',

    // Inspectie
    h_inspections:'Inspecties', btn_new_inspection:'+ Nieuwe inspectie', empty_inspections:'Nog geen inspecties uitgevoerd',
    h_new_inspection:'Nieuwe Inspectie', lbl_insp_name:'Naam inspectie *', lbl_insp_type:'Type',
    type_free:'Vrije inspectie', type_checklist:'Checklist-inspectie',
    lbl_template:'Checklist template', ph_template:'-- Kies template --',
    lbl_floor:'Plattegrond', ph_floor:'-- Optioneel --', lbl_inspector:'Inspecteur',
    btn_start_inspection:'Inspectie Starten', btn_back:'Terug', btn_finish_inspection:'Inspectie Afronden',
    lbl_general_notes:'Algemene opmerkingen', ph_insp_notes:'Opmerkingen bij deze inspectie...',
    insp_signed:'Ondertekend', insp_in_progress:'In uitvoering', insp_rejected:'afgekeurd',

    // Signature
    h_sign:'Inspectie Ondertekenen', lbl_sign_name:'Naam ondertekenaar', ph_sign_name:'Uw volledige naam',
    lbl_signature:'Handtekening', btn_clear:'Wissen', btn_sign:'Ondertekenen & Afronden',

    // NEN 2767
    nen_1:'Uitstekend', nen_2:'Goed', nen_3:'Redelijk', nen_4:'Matig', nen_5:'Slecht', nen_6:'Zeer slecht',
    nen_avg:'Gem.', nen_label:'NEN 2767', nen_score:'Gem. score',

    // Oplevering
    h_handovers:'Opleveringen', btn_new_handover:'+ Nieuwe oplevering', empty_handovers:'Nog geen opleveringen',
    h_new_handover:'Nieuwe Oplevering', lbl_ho_type:'Type oplevering',
    ho_pre:'Vooroplevering', ho_first:'Eerste oplevering', ho_second:'Tweede oplevering / Naschouw',
    h_participants:'Deelnemers', btn_add_participant:'+ Deelnemer',
    btn_start_handover:'Oplevering Starten', ho_assessed:'beoordeeld',
    h_documents:'Documenten', upload_docs:'Sleep documenten hierheen (garanties, certificaten, keuringsrapporten)',
    btn_finish_handover:'Oplevering Afronden & Ondertekenen', empty_ho_items:'Geen openstaande tickets',

    // Handover sign
    h_ho_sign:'Proces-Verbaal Ondertekenen', lbl_verdict:'Eindoordeel',
    verdict_approved:'Goedgekeurd', verdict_conditional:'Goedgekeurd onder voorbehoud', verdict_rejected:'Afgekeurd',
    btn_add_signature:'+ Handtekening toevoegen', lbl_role:'Rol',
    ho_completed:'Afgerond', ho_in_progress:'In uitvoering', ho_approved:'goedgekeurd',

    // Dashboard
    stat_total:'Totaal Tickets', stat_open:'Open', stat_assigned:'Toegewezen', stat_completed:'Afgerond',
    stat_overdue:'Verlopen deadline', stat_inspections:'Inspecties',
    chart_status:'Tickets per status', chart_category:'Tickets per categorie',
    chart_assignee:'Tickets per verantwoordelijke', chart_activity:'Recente activiteit',
    no_assignments:'Geen toewijzingen', empty_activity:'Nog geen activiteit',
    lbl_overdue:'Verlopen',

    // Export
    h_export:'Project Exporteren', h_overview:'Overzicht', h_report_type:'Rapport type',
    export_full:'Volledig projectrapport', export_tickets:'Puntenlijst (open tickets)',
    export_inspection:'Inspectie-rapport', export_handover:'Proces-verbaal van oplevering',
    lbl_select_inspection:'Selecteer inspectie:', lbl_select_handover:'Selecteer oplevering:',
    h_options:'Opties', opt_photos:'Foto\'s insluiten', opt_map:'Plattegrond met markeringen',
    btn_export_html:'Exporteer als HTML', btn_save_json:'Project Opslaan (JSON)',
    btn_load_json:'Project Laden', btn_clear_all:'Alles Wissen',
    empty_export:'Vul eerst projectgegevens in.',

    // Notifications
    msg_saved:'Project opgeslagen!', msg_contact_saved:'Contact opgeslagen',
    msg_ticket_saved:'Ticket opgeslagen!', msg_ticket_deleted:'Ticket verwijderd',
    msg_photo_captured:'Foto vastgelegd!', msg_insp_signed:'Inspectie ondertekend en afgerond!',
    msg_ho_signed:'Oplevering ondertekend!', msg_export_ok:'Export succesvol!',
    msg_json_saved:'Bestand opgeslagen!', msg_json_downloaded:'Bestand gedownload!',
    msg_loaded:'Project geladen!', msg_cleared:'Alle data gewist!',
    msg_fill_name:'Vul een naam in', msg_fill_label:'Vul een label in',
    msg_camera_error:'Camera niet beschikbaar. Controleer uw toestemming.',
    msg_camera_switch_fail:'Camera wisselen mislukt', msg_pdf_processing:'PDF wordt verwerkt...',
    msg_pdf_done:'pagina\'s toegevoegd!', msg_pdf_error:'Fout bij PDF verwerking',
    msg_corrupt:'Corrupte data opgeschoond', msg_load_error:'Fout bij laden',
    msg_confirm_delete:'Verwijderen?', msg_confirm_clear:'Alle data wissen? Dit kan niet ongedaan worden.',
    msg_confirm_delete_plan:'Plattegrond verwijderen?',

    // Camera
    h_camera:'Foto maken', btn_camera_switch:'Wissel camera', btn_camera_close:'Sluiten',

    // Activity log
    log_ticket_created:'Ticket "{0}" aangemaakt', log_ticket_edited:'Ticket "{0}" bewerkt',
    log_ticket_deleted:'Ticket "{0}" verwijderd', log_insp_started:'Inspectie "{0}" gestart',
    log_insp_signed:'Inspectie "{0}" ondertekend door {1}',
    log_ho_started:'{0} gestart', log_ho_completed:'{0} afgerond: {1}',

    // Summary labels
    sum_project:'Project', sum_address:'Adres', sum_plans:'Plattegronden', sum_tickets:'Tickets',
    sum_photos:'Foto\'s', sum_inspections:'Inspecties', sum_handovers:'Opleveringen',
    sum_not_filled:'Niet ingevuld',

    // Report
    report_generated:'Gegenereerd met Open Field Studio op',
    report_pv_title:'Proces-Verbaal van Oplevering', report_project_data:'Projectgegevens',
    report_participants:'Deelnemers', report_items:'Opleverpunten', report_verdict:'Eindoordeel',
    report_signatures:'Handtekeningen', report_no_tickets:'Geen tickets',
    tbl_name:'Naam', tbl_role:'Rol', tbl_company:'Bedrijf', tbl_point:'Punt', tbl_category:'Categorie',
    tbl_priority:'Prioriteit', tbl_verdict:'Oordeel',
    verdict_approved_label:'GOEDGEKEURD', verdict_conditional_label:'GOEDGEKEURD ONDER VOORBEHOUD', verdict_rejected_label:'AFGEKEURD',
    verdict_not_assessed:'Niet beoordeeld',
},

// ==================== ENGLISH ====================
en: {
    nav_project:'Project', nav_plans:'Floor Plans', nav_opname:'Survey', nav_inspectie:'Inspection',
    nav_oplevering:'Handover', nav_dashboard:'Dashboard', nav_export:'Export', nav_handleiding:'Manual',

    h_project:'Project Details', lbl_name:'Project Name *', lbl_number:'Project Number', lbl_client:'Client',
    lbl_contact:'Contact Person', lbl_address:'Street and Number *', lbl_postal:'Postal Code *', lbl_city:'City *',
    lbl_date:'Survey Date', lbl_surveyor:'Surveyed by', lbl_description:'Project Description', lbl_notes:'Notes',
    ph_name:'e.g. Office Building Renovation', ph_number:'e.g. 2024-001', ph_client:'Client name',
    ph_contact:'Contact person name', ph_address:'e.g. Main Street 123', ph_postal:'12345', ph_city:'London',
    ph_surveyor:'Your name', ph_description:'Brief project description...', ph_notes:'Additional notes...',
    btn_save_project:'Save Project', h_contacts:'Contacts', btn_add_contact:'+ Add Contact',
    empty_contacts:'No contacts yet',

    contact_add:'Add Contact', contact_edit:'Edit Contact', lbl_contact_name:'Name *',
    lbl_contact_role:'Role', lbl_contact_company:'Company', lbl_contact_email:'Email', lbl_contact_phone:'Phone',
    ph_contact_name:'Full name', ph_contact_company:'Company name', ph_contact_email:'email@example.com', ph_contact_phone:'+44 7911 123456',

    role_projectleider:'Project Manager', role_inspecteur:'Inspector', role_uitvoerder:'Site Manager',
    role_onderaannemer:'Subcontractor', role_opdrachtgever:'Client', role_kwaliteitsborger:'Quality Controller', role_overig:'Other',

    h_plans:'Floor Plans', upload_text:'Drag floor plans here or click to upload', upload_hint:'JPG, PNG, PDF',
    btn_select:'Select', btn_delete:'Delete',

    lbl_select_plan:'Floor plan:', ph_select_plan:'-- Choose a floor plan --',
    filter_all_status:'All statuses', filter_all_cat:'All categories', filter_all_pri:'All priorities',
    btn_add_ticket:'Add Ticket', placeholder_canvas:'Select a floor plan to add tickets',
    h_tickets:'Tickets', empty_tickets:'No tickets added yet', empty_filtered:'No tickets found',

    ticket_add:'Add Ticket', ticket_edit:'Edit Ticket', lbl_label:'Label *', lbl_category:'Category',
    lbl_priority:'Priority', lbl_severity:'Severity', lbl_status:'Status', lbl_assigned:'Assigned to',
    lbl_deadline:'Deadline', lbl_desc:'Description', lbl_photos:'Photos',
    ph_label:'e.g. Crack in wall', ph_desc:'Description of the defect...', ph_nobody:'-- Nobody --',
    upload_photos:'Drag photos here or click to upload', btn_camera:'Take photo with camera',
    lbl_comments:'Comments', ph_comment:'Add a comment...', btn_send:'Send',
    btn_cancel:'Cancel', btn_remove:'Delete', btn_save:'Save',

    cat_bouwkundig:'Structural', cat_schilderwerk:'Painting & finishing', cat_sanitair:'Plumbing',
    cat_elektra:'Electrical & lighting', cat_hvac:'HVAC / climate', cat_dakwerk:'Roofing',
    cat_kozijnen:'Windows & glazing', cat_vloeren:'Floors & tiling', cat_buitenruimte:'Exterior',
    cat_veiligheid:'Safety', cat_overig:'Other',

    status_open:'Open', status_assigned:'Assigned', status_completed:'Completed',
    status_verified:'Verified', status_archived:'Archived',

    pri_high:'High', pri_medium:'Medium', pri_low:'Low',
    sev_cosmetic:'Cosmetic', sev_functional:'Functional', sev_safety:'Safety', sev_structural:'Structural',

    h_inspections:'Inspections', btn_new_inspection:'+ New Inspection', empty_inspections:'No inspections performed yet',
    h_new_inspection:'New Inspection', lbl_insp_name:'Inspection Name *', lbl_insp_type:'Type',
    type_free:'Free inspection', type_checklist:'Checklist inspection',
    lbl_template:'Checklist template', ph_template:'-- Choose template --',
    lbl_floor:'Floor plan', ph_floor:'-- Optional --', lbl_inspector:'Inspector',
    btn_start_inspection:'Start Inspection', btn_back:'Back', btn_finish_inspection:'Finish Inspection',
    lbl_general_notes:'General notes', ph_insp_notes:'Notes for this inspection...',
    insp_signed:'Signed', insp_in_progress:'In progress', insp_rejected:'rejected',

    h_sign:'Sign Inspection', lbl_sign_name:'Name of signer', ph_sign_name:'Your full name',
    lbl_signature:'Signature', btn_clear:'Clear', btn_sign:'Sign & Complete',

    nen_1:'Excellent', nen_2:'Good', nen_3:'Fair', nen_4:'Moderate', nen_5:'Poor', nen_6:'Very poor',
    nen_avg:'Avg.', nen_label:'NEN 2767', nen_score:'Avg. score',

    h_handovers:'Handovers', btn_new_handover:'+ New Handover', empty_handovers:'No handovers yet',
    h_new_handover:'New Handover', lbl_ho_type:'Handover Type',
    ho_pre:'Pre-handover', ho_first:'First handover', ho_second:'Second handover / Re-inspection',
    h_participants:'Participants', btn_add_participant:'+ Participant',
    btn_start_handover:'Start Handover', ho_assessed:'assessed',
    h_documents:'Documents', upload_docs:'Drag documents here (warranties, certificates, test reports)',
    btn_finish_handover:'Complete & Sign Handover', empty_ho_items:'No open tickets',

    h_ho_sign:'Sign Handover Certificate', lbl_verdict:'Final Verdict',
    verdict_approved:'Approved', verdict_conditional:'Approved with conditions', verdict_rejected:'Rejected',
    btn_add_signature:'+ Add Signature', lbl_role:'Role',
    ho_completed:'Completed', ho_in_progress:'In progress', ho_approved:'approved',

    stat_total:'Total Tickets', stat_open:'Open', stat_assigned:'Assigned', stat_completed:'Completed',
    stat_overdue:'Overdue', stat_inspections:'Inspections',
    chart_status:'Tickets by status', chart_category:'Tickets by category',
    chart_assignee:'Tickets by assignee', chart_activity:'Recent activity',
    no_assignments:'No assignments', empty_activity:'No activity yet', lbl_overdue:'Overdue',

    h_export:'Export Project', h_overview:'Overview', h_report_type:'Report Type',
    export_full:'Full project report', export_tickets:'Punch list (open tickets)',
    export_inspection:'Inspection report', export_handover:'Handover certificate',
    lbl_select_inspection:'Select inspection:', lbl_select_handover:'Select handover:',
    h_options:'Options', opt_photos:'Include photos', opt_map:'Floor plan with markers',
    btn_export_html:'Export as HTML', btn_save_json:'Save Project (JSON)',
    btn_load_json:'Load Project', btn_clear_all:'Clear All',
    empty_export:'Fill in project details first.',

    msg_saved:'Project saved!', msg_contact_saved:'Contact saved',
    msg_ticket_saved:'Ticket saved!', msg_ticket_deleted:'Ticket deleted',
    msg_photo_captured:'Photo captured!', msg_insp_signed:'Inspection signed and completed!',
    msg_ho_signed:'Handover signed!', msg_export_ok:'Export successful!',
    msg_json_saved:'File saved!', msg_json_downloaded:'File downloaded!',
    msg_loaded:'Project loaded!', msg_cleared:'All data cleared!',
    msg_fill_name:'Please enter a name', msg_fill_label:'Please enter a label',
    msg_camera_error:'Camera not available. Check your permissions.',
    msg_camera_switch_fail:'Camera switch failed', msg_pdf_processing:'Processing PDF...',
    msg_pdf_done:'pages added!', msg_pdf_error:'Error processing PDF',
    msg_corrupt:'Corrupt data cleaned up', msg_load_error:'Error loading file',
    msg_confirm_delete:'Delete?', msg_confirm_clear:'Clear all data? This cannot be undone.',
    msg_confirm_delete_plan:'Delete floor plan?',

    h_camera:'Take Photo', btn_camera_switch:'Switch camera', btn_camera_close:'Close',

    log_ticket_created:'Ticket "{0}" created', log_ticket_edited:'Ticket "{0}" edited',
    log_ticket_deleted:'Ticket "{0}" deleted', log_insp_started:'Inspection "{0}" started',
    log_insp_signed:'Inspection "{0}" signed by {1}',
    log_ho_started:'{0} started', log_ho_completed:'{0} completed: {1}',

    sum_project:'Project', sum_address:'Address', sum_plans:'Floor Plans', sum_tickets:'Tickets',
    sum_photos:'Photos', sum_inspections:'Inspections', sum_handovers:'Handovers',
    sum_not_filled:'Not filled in',

    report_generated:'Generated with Open Field Studio on',
    report_pv_title:'Handover Certificate', report_project_data:'Project Details',
    report_participants:'Participants', report_items:'Handover Items', report_verdict:'Final Verdict',
    report_signatures:'Signatures', report_no_tickets:'No tickets',
    tbl_name:'Name', tbl_role:'Role', tbl_company:'Company', tbl_point:'Item', tbl_category:'Category',
    tbl_priority:'Priority', tbl_verdict:'Verdict',
    verdict_approved_label:'APPROVED', verdict_conditional_label:'APPROVED WITH CONDITIONS', verdict_rejected_label:'REJECTED',
    verdict_not_assessed:'Not assessed',
},

// ==================== DEUTSCH ====================
de: {
    nav_project:'Projekt', nav_plans:'Grundrisse', nav_opname:'Aufnahme', nav_inspectie:'Inspektion',
    nav_oplevering:'Abnahme', nav_dashboard:'Dashboard', nav_export:'Export', nav_handleiding:'Anleitung',

    h_project:'Projektdaten', lbl_name:'Projektname *', lbl_number:'Projektnummer', lbl_client:'Auftraggeber',
    lbl_contact:'Ansprechpartner', lbl_address:'Strasse und Hausnummer *', lbl_postal:'Postleitzahl *', lbl_city:'Ort *',
    lbl_date:'Aufnahmedatum', lbl_surveyor:'Aufgenommen von', lbl_description:'Projektbeschreibung', lbl_notes:'Bemerkungen',
    ph_name:'z.B. Sanierung Bürogebäude', ph_number:'z.B. 2024-001', ph_client:'Name des Auftraggebers',
    ph_contact:'Name des Ansprechpartners', ph_address:'z.B. Hauptstraße 123', ph_postal:'12345', ph_city:'Berlin',
    ph_surveyor:'Ihr Name', ph_description:'Kurze Projektbeschreibung...', ph_notes:'Zusätzliche Bemerkungen...',
    btn_save_project:'Projekt speichern', h_contacts:'Kontakte', btn_add_contact:'+ Kontakt hinzufügen',
    empty_contacts:'Noch keine Kontakte',

    contact_add:'Kontakt hinzufügen', contact_edit:'Kontakt bearbeiten', lbl_contact_name:'Name *',
    lbl_contact_role:'Rolle', lbl_contact_company:'Firma', lbl_contact_email:'E-Mail', lbl_contact_phone:'Telefon',
    ph_contact_name:'Vollständiger Name', ph_contact_company:'Firmenname', ph_contact_email:'email@beispiel.de', ph_contact_phone:'+49 170 1234567',

    role_projectleider:'Projektleiter', role_inspecteur:'Inspektor', role_uitvoerder:'Bauleiter',
    role_onderaannemer:'Subunternehmer', role_opdrachtgever:'Auftraggeber', role_kwaliteitsborger:'Qualitätsprüfer', role_overig:'Sonstige',

    h_plans:'Grundrisse', upload_text:'Grundrisse hierher ziehen oder klicken zum Hochladen', upload_hint:'JPG, PNG, PDF',
    btn_select:'Auswählen', btn_delete:'Löschen',

    lbl_select_plan:'Grundriss:', ph_select_plan:'-- Grundriss wählen --',
    filter_all_status:'Alle Status', filter_all_cat:'Alle Kategorien', filter_all_pri:'Alle Prioritäten',
    btn_add_ticket:'Ticket hinzufügen', placeholder_canvas:'Grundriss auswählen um Tickets hinzuzufügen',
    h_tickets:'Tickets', empty_tickets:'Noch keine Tickets', empty_filtered:'Keine Tickets gefunden',

    ticket_add:'Ticket hinzufügen', ticket_edit:'Ticket bearbeiten', lbl_label:'Bezeichnung *', lbl_category:'Kategorie',
    lbl_priority:'Priorität', lbl_severity:'Schweregrad', lbl_status:'Status', lbl_assigned:'Zugewiesen an',
    lbl_deadline:'Frist', lbl_desc:'Beschreibung', lbl_photos:'Fotos',
    ph_label:'z.B. Riss in der Wand', ph_desc:'Beschreibung des Mangels...', ph_nobody:'-- Niemand --',
    upload_photos:'Fotos hierher ziehen oder klicken', btn_camera:'Foto mit Kamera aufnehmen',
    lbl_comments:'Kommentare', ph_comment:'Kommentar hinzufügen...', btn_send:'Senden',
    btn_cancel:'Abbrechen', btn_remove:'Löschen', btn_save:'Speichern',

    cat_bouwkundig:'Baukonstruktion', cat_schilderwerk:'Malerarbeiten', cat_sanitair:'Sanitär',
    cat_elektra:'Elektro & Beleuchtung', cat_hvac:'HLK / Klima', cat_dakwerk:'Dacharbeiten',
    cat_kozijnen:'Fenster & Verglasung', cat_vloeren:'Böden & Fliesen', cat_buitenruimte:'Aussenbereich',
    cat_veiligheid:'Sicherheit', cat_overig:'Sonstige',

    status_open:'Offen', status_assigned:'Zugewiesen', status_completed:'Erledigt',
    status_verified:'Verifiziert', status_archived:'Archiviert',

    pri_high:'Hoch', pri_medium:'Mittel', pri_low:'Niedrig',
    sev_cosmetic:'Kosmetisch', sev_functional:'Funktional', sev_safety:'Sicherheit', sev_structural:'Strukturell',

    h_inspections:'Inspektionen', btn_new_inspection:'+ Neue Inspektion', empty_inspections:'Noch keine Inspektionen',
    h_new_inspection:'Neue Inspektion', lbl_insp_name:'Name der Inspektion *', lbl_insp_type:'Typ',
    type_free:'Freie Inspektion', type_checklist:'Checklisten-Inspektion',
    lbl_template:'Checklisten-Vorlage', ph_template:'-- Vorlage wählen --',
    lbl_floor:'Grundriss', ph_floor:'-- Optional --', lbl_inspector:'Inspektor',
    btn_start_inspection:'Inspektion starten', btn_back:'Zurück', btn_finish_inspection:'Inspektion abschliessen',
    lbl_general_notes:'Allgemeine Bemerkungen', ph_insp_notes:'Bemerkungen zu dieser Inspektion...',
    insp_signed:'Unterzeichnet', insp_in_progress:'In Bearbeitung', insp_rejected:'abgelehnt',

    h_sign:'Inspektion unterzeichnen', lbl_sign_name:'Name des Unterzeichners', ph_sign_name:'Ihr vollständiger Name',
    lbl_signature:'Unterschrift', btn_clear:'Löschen', btn_sign:'Unterzeichnen & Abschliessen',

    nen_1:'Ausgezeichnet', nen_2:'Gut', nen_3:'Befriedigend', nen_4:'Mässig', nen_5:'Schlecht', nen_6:'Sehr schlecht',
    nen_avg:'Durchschn.', nen_label:'NEN 2767', nen_score:'Durchschn. Score',

    h_handovers:'Abnahmen', btn_new_handover:'+ Neue Abnahme', empty_handovers:'Noch keine Abnahmen',
    h_new_handover:'Neue Abnahme', lbl_ho_type:'Art der Abnahme',
    ho_pre:'Vorabnahme', ho_first:'Erstabnahme', ho_second:'Zweitabnahme / Nachkontrolle',
    h_participants:'Teilnehmer', btn_add_participant:'+ Teilnehmer',
    btn_start_handover:'Abnahme starten', ho_assessed:'bewertet',
    h_documents:'Dokumente', upload_docs:'Dokumente hierher ziehen (Garantien, Zertifikate, Prüfberichte)',
    btn_finish_handover:'Abnahme abschliessen & unterzeichnen', empty_ho_items:'Keine offenen Tickets',

    h_ho_sign:'Abnahmeprotokoll unterzeichnen', lbl_verdict:'Gesamturteil',
    verdict_approved:'Abgenommen', verdict_conditional:'Abgenommen mit Vorbehalten', verdict_rejected:'Abgelehnt',
    btn_add_signature:'+ Unterschrift hinzufügen', lbl_role:'Rolle',
    ho_completed:'Abgeschlossen', ho_in_progress:'In Bearbeitung', ho_approved:'abgenommen',

    stat_total:'Tickets gesamt', stat_open:'Offen', stat_assigned:'Zugewiesen', stat_completed:'Erledigt',
    stat_overdue:'Überfällig', stat_inspections:'Inspektionen',
    chart_status:'Tickets nach Status', chart_category:'Tickets nach Kategorie',
    chart_assignee:'Tickets nach Zuständigkeit', chart_activity:'Letzte Aktivitäten',
    no_assignments:'Keine Zuweisungen', empty_activity:'Noch keine Aktivitäten', lbl_overdue:'Überfällig',

    h_export:'Projekt exportieren', h_overview:'Übersicht', h_report_type:'Berichtstyp',
    export_full:'Vollständiger Projektbericht', export_tickets:'Mängelliste (offene Tickets)',
    export_inspection:'Inspektionsbericht', export_handover:'Abnahmeprotokoll',
    lbl_select_inspection:'Inspektion auswählen:', lbl_select_handover:'Abnahme auswählen:',
    h_options:'Optionen', opt_photos:'Fotos einbinden', opt_map:'Grundriss mit Markierungen',
    btn_export_html:'Als HTML exportieren', btn_save_json:'Projekt speichern (JSON)',
    btn_load_json:'Projekt laden', btn_clear_all:'Alles löschen',
    empty_export:'Bitte zuerst Projektdaten ausfüllen.',

    msg_saved:'Projekt gespeichert!', msg_contact_saved:'Kontakt gespeichert',
    msg_ticket_saved:'Ticket gespeichert!', msg_ticket_deleted:'Ticket gelöscht',
    msg_photo_captured:'Foto aufgenommen!', msg_insp_signed:'Inspektion unterzeichnet!',
    msg_ho_signed:'Abnahme unterzeichnet!', msg_export_ok:'Export erfolgreich!',
    msg_json_saved:'Datei gespeichert!', msg_json_downloaded:'Datei heruntergeladen!',
    msg_loaded:'Projekt geladen!', msg_cleared:'Alle Daten gelöscht!',
    msg_fill_name:'Bitte Namen eingeben', msg_fill_label:'Bitte Bezeichnung eingeben',
    msg_camera_error:'Kamera nicht verfügbar. Prüfen Sie die Berechtigung.',
    msg_camera_switch_fail:'Kamerawechsel fehlgeschlagen', msg_pdf_processing:'PDF wird verarbeitet...',
    msg_pdf_done:'Seiten hinzugefügt!', msg_pdf_error:'Fehler bei PDF-Verarbeitung',
    msg_corrupt:'Beschädigte Daten bereinigt', msg_load_error:'Fehler beim Laden',
    msg_confirm_delete:'Löschen?', msg_confirm_clear:'Alle Daten löschen? Dies kann nicht rückgängig gemacht werden.',
    msg_confirm_delete_plan:'Grundriss löschen?',

    h_camera:'Foto aufnehmen', btn_camera_switch:'Kamera wechseln', btn_camera_close:'Schliessen',

    log_ticket_created:'Ticket "{0}" erstellt', log_ticket_edited:'Ticket "{0}" bearbeitet',
    log_ticket_deleted:'Ticket "{0}" gelöscht', log_insp_started:'Inspektion "{0}" gestartet',
    log_insp_signed:'Inspektion "{0}" unterzeichnet von {1}',
    log_ho_started:'{0} gestartet', log_ho_completed:'{0} abgeschlossen: {1}',

    sum_project:'Projekt', sum_address:'Adresse', sum_plans:'Grundrisse', sum_tickets:'Tickets',
    sum_photos:'Fotos', sum_inspections:'Inspektionen', sum_handovers:'Abnahmen',
    sum_not_filled:'Nicht ausgefüllt',

    report_generated:'Erstellt mit Open Field Studio am',
    report_pv_title:'Abnahmeprotokoll', report_project_data:'Projektdaten',
    report_participants:'Teilnehmer', report_items:'Abnahmepunkte', report_verdict:'Gesamturteil',
    report_signatures:'Unterschriften', report_no_tickets:'Keine Tickets',
    tbl_name:'Name', tbl_role:'Rolle', tbl_company:'Firma', tbl_point:'Punkt', tbl_category:'Kategorie',
    tbl_priority:'Priorität', tbl_verdict:'Urteil',
    verdict_approved_label:'ABGENOMMEN', verdict_conditional_label:'ABGENOMMEN MIT VORBEHALTEN', verdict_rejected_label:'ABGELEHNT',
    verdict_not_assessed:'Nicht bewertet',
},

// ==================== FRANÇAIS ====================
fr: {
    nav_project:'Projet', nav_plans:'Plans', nav_opname:'Relevé', nav_inspectie:'Inspection',
    nav_oplevering:'Réception', nav_dashboard:'Tableau de bord', nav_export:'Export', nav_handleiding:'Guide',

    h_project:'Données du projet', lbl_name:'Nom du projet *', lbl_number:'Numéro de projet', lbl_client:'Maître d\'ouvrage',
    lbl_contact:'Personne de contact', lbl_address:'Rue et numéro *', lbl_postal:'Code postal *', lbl_city:'Ville *',
    lbl_date:'Date du relevé', lbl_surveyor:'Relevé par', lbl_description:'Description du projet', lbl_notes:'Remarques',
    ph_name:'ex. Rénovation immeuble de bureaux', ph_number:'ex. 2024-001', ph_client:'Nom du maître d\'ouvrage',
    ph_contact:'Nom de la personne de contact', ph_address:'ex. Rue Principale 123', ph_postal:'75001', ph_city:'Paris',
    ph_surveyor:'Votre nom', ph_description:'Brève description du projet...', ph_notes:'Remarques supplémentaires...',
    btn_save_project:'Enregistrer le projet', h_contacts:'Contacts', btn_add_contact:'+ Ajouter un contact',
    empty_contacts:'Aucun contact',

    contact_add:'Ajouter un contact', contact_edit:'Modifier le contact', lbl_contact_name:'Nom *',
    lbl_contact_role:'Rôle', lbl_contact_company:'Entreprise', lbl_contact_email:'E-mail', lbl_contact_phone:'Téléphone',
    ph_contact_name:'Nom complet', ph_contact_company:'Nom de l\'entreprise', ph_contact_email:'email@exemple.fr', ph_contact_phone:'+33 6 12 34 56 78',

    role_projectleider:'Chef de projet', role_inspecteur:'Inspecteur', role_uitvoerder:'Conducteur de travaux',
    role_onderaannemer:'Sous-traitant', role_opdrachtgever:'Maître d\'ouvrage', role_kwaliteitsborger:'Contrôleur qualité', role_overig:'Autre',

    h_plans:'Plans', upload_text:'Glissez les plans ici ou cliquez pour télécharger', upload_hint:'JPG, PNG, PDF',
    btn_select:'Sélectionner', btn_delete:'Supprimer',

    lbl_select_plan:'Plan :', ph_select_plan:'-- Choisir un plan --',
    filter_all_status:'Tous les statuts', filter_all_cat:'Toutes les catégories', filter_all_pri:'Toutes les priorités',
    btn_add_ticket:'Ajouter un ticket', placeholder_canvas:'Sélectionnez un plan pour ajouter des tickets',
    h_tickets:'Tickets', empty_tickets:'Aucun ticket ajouté', empty_filtered:'Aucun ticket trouvé',

    ticket_add:'Ajouter un ticket', ticket_edit:'Modifier le ticket', lbl_label:'Libellé *', lbl_category:'Catégorie',
    lbl_priority:'Priorité', lbl_severity:'Gravité', lbl_status:'Statut', lbl_assigned:'Assigné à',
    lbl_deadline:'Échéance', lbl_desc:'Description', lbl_photos:'Photos',
    ph_label:'ex. Fissure dans le mur', ph_desc:'Description du défaut...', ph_nobody:'-- Personne --',
    upload_photos:'Glissez les photos ici ou cliquez', btn_camera:'Prendre une photo',
    lbl_comments:'Commentaires', ph_comment:'Ajouter un commentaire...', btn_send:'Envoyer',
    btn_cancel:'Annuler', btn_remove:'Supprimer', btn_save:'Enregistrer',

    cat_bouwkundig:'Gros oeuvre', cat_schilderwerk:'Peinture & finitions', cat_sanitair:'Plomberie',
    cat_elektra:'Électricité & éclairage', cat_hvac:'CVC / climat', cat_dakwerk:'Toiture',
    cat_kozijnen:'Menuiseries & vitrage', cat_vloeren:'Sols & carrelage', cat_buitenruimte:'Extérieur',
    cat_veiligheid:'Sécurité', cat_overig:'Autre',

    status_open:'Ouvert', status_assigned:'Assigné', status_completed:'Terminé',
    status_verified:'Vérifié', status_archived:'Archivé',

    pri_high:'Haute', pri_medium:'Moyenne', pri_low:'Basse',
    sev_cosmetic:'Cosmétique', sev_functional:'Fonctionnel', sev_safety:'Sécurité', sev_structural:'Structurel',

    h_inspections:'Inspections', btn_new_inspection:'+ Nouvelle inspection', empty_inspections:'Aucune inspection réalisée',
    h_new_inspection:'Nouvelle Inspection', lbl_insp_name:'Nom de l\'inspection *', lbl_insp_type:'Type',
    type_free:'Inspection libre', type_checklist:'Inspection par checklist',
    lbl_template:'Modèle de checklist', ph_template:'-- Choisir un modèle --',
    lbl_floor:'Plan', ph_floor:'-- Optionnel --', lbl_inspector:'Inspecteur',
    btn_start_inspection:'Démarrer l\'inspection', btn_back:'Retour', btn_finish_inspection:'Terminer l\'inspection',
    lbl_general_notes:'Remarques générales', ph_insp_notes:'Remarques pour cette inspection...',
    insp_signed:'Signé', insp_in_progress:'En cours', insp_rejected:'rejeté',

    h_sign:'Signer l\'inspection', lbl_sign_name:'Nom du signataire', ph_sign_name:'Votre nom complet',
    lbl_signature:'Signature', btn_clear:'Effacer', btn_sign:'Signer & Terminer',

    nen_1:'Excellent', nen_2:'Bon', nen_3:'Acceptable', nen_4:'Moyen', nen_5:'Mauvais', nen_6:'Très mauvais',
    nen_avg:'Moy.', nen_label:'NEN 2767', nen_score:'Score moy.',

    h_handovers:'Réceptions', btn_new_handover:'+ Nouvelle réception', empty_handovers:'Aucune réception',
    h_new_handover:'Nouvelle Réception', lbl_ho_type:'Type de réception',
    ho_pre:'Pré-réception', ho_first:'Première réception', ho_second:'Deuxième réception / Contre-visite',
    h_participants:'Participants', btn_add_participant:'+ Participant',
    btn_start_handover:'Démarrer la réception', ho_assessed:'évalué',
    h_documents:'Documents', upload_docs:'Glissez les documents ici (garanties, certificats, rapports)',
    btn_finish_handover:'Terminer & Signer la réception', empty_ho_items:'Aucun ticket ouvert',

    h_ho_sign:'Signer le procès-verbal', lbl_verdict:'Verdict final',
    verdict_approved:'Approuvé', verdict_conditional:'Approuvé sous réserve', verdict_rejected:'Rejeté',
    btn_add_signature:'+ Ajouter une signature', lbl_role:'Rôle',
    ho_completed:'Terminé', ho_in_progress:'En cours', ho_approved:'approuvé',

    stat_total:'Total Tickets', stat_open:'Ouverts', stat_assigned:'Assignés', stat_completed:'Terminés',
    stat_overdue:'En retard', stat_inspections:'Inspections',
    chart_status:'Tickets par statut', chart_category:'Tickets par catégorie',
    chart_assignee:'Tickets par responsable', chart_activity:'Activité récente',
    no_assignments:'Aucune assignation', empty_activity:'Aucune activité', lbl_overdue:'En retard',

    h_export:'Exporter le projet', h_overview:'Aperçu', h_report_type:'Type de rapport',
    export_full:'Rapport de projet complet', export_tickets:'Liste de réserves (tickets ouverts)',
    export_inspection:'Rapport d\'inspection', export_handover:'Procès-verbal de réception',
    lbl_select_inspection:'Sélectionner l\'inspection :', lbl_select_handover:'Sélectionner la réception :',
    h_options:'Options', opt_photos:'Inclure les photos', opt_map:'Plan avec marqueurs',
    btn_export_html:'Exporter en HTML', btn_save_json:'Enregistrer le projet (JSON)',
    btn_load_json:'Charger un projet', btn_clear_all:'Tout effacer',
    empty_export:'Veuillez d\'abord remplir les données du projet.',

    msg_saved:'Projet enregistré !', msg_contact_saved:'Contact enregistré',
    msg_ticket_saved:'Ticket enregistré !', msg_ticket_deleted:'Ticket supprimé',
    msg_photo_captured:'Photo prise !', msg_insp_signed:'Inspection signée et terminée !',
    msg_ho_signed:'Réception signée !', msg_export_ok:'Export réussi !',
    msg_json_saved:'Fichier enregistré !', msg_json_downloaded:'Fichier téléchargé !',
    msg_loaded:'Projet chargé !', msg_cleared:'Toutes les données effacées !',
    msg_fill_name:'Veuillez entrer un nom', msg_fill_label:'Veuillez entrer un libellé',
    msg_camera_error:'Caméra non disponible. Vérifiez vos autorisations.',
    msg_camera_switch_fail:'Échec du changement de caméra', msg_pdf_processing:'Traitement du PDF...',
    msg_pdf_done:'pages ajoutées !', msg_pdf_error:'Erreur lors du traitement du PDF',
    msg_corrupt:'Données corrompues nettoyées', msg_load_error:'Erreur lors du chargement',
    msg_confirm_delete:'Supprimer ?', msg_confirm_clear:'Effacer toutes les données ? Cette action est irréversible.',
    msg_confirm_delete_plan:'Supprimer le plan ?',

    h_camera:'Prendre une photo', btn_camera_switch:'Changer de caméra', btn_camera_close:'Fermer',

    log_ticket_created:'Ticket "{0}" créé', log_ticket_edited:'Ticket "{0}" modifié',
    log_ticket_deleted:'Ticket "{0}" supprimé', log_insp_started:'Inspection "{0}" démarrée',
    log_insp_signed:'Inspection "{0}" signée par {1}',
    log_ho_started:'{0} démarrée', log_ho_completed:'{0} terminée : {1}',

    sum_project:'Projet', sum_address:'Adresse', sum_plans:'Plans', sum_tickets:'Tickets',
    sum_photos:'Photos', sum_inspections:'Inspections', sum_handovers:'Réceptions',
    sum_not_filled:'Non renseigné',

    report_generated:'Généré avec Open Field Studio le',
    report_pv_title:'Procès-Verbal de Réception', report_project_data:'Données du projet',
    report_participants:'Participants', report_items:'Points de réception', report_verdict:'Verdict final',
    report_signatures:'Signatures', report_no_tickets:'Aucun ticket',
    tbl_name:'Nom', tbl_role:'Rôle', tbl_company:'Entreprise', tbl_point:'Point', tbl_category:'Catégorie',
    tbl_priority:'Priorité', tbl_verdict:'Verdict',
    verdict_approved_label:'APPROUVÉ', verdict_conditional_label:'APPROUVÉ SOUS RÉSERVE', verdict_rejected_label:'REJETÉ',
    verdict_not_assessed:'Non évalué',
}

};
