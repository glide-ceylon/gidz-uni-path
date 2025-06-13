<section className="mb-6">
  <h2 className="text-2xl font-semibold mb-4">Documents</h2>
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <DocumentItem
      label="OL (Ministry Translated)"
      isUploaded={getDocIsUploaded(applicant, "OL")}
    />
    
    <DocumentItem
      label="AL (Ministry Translated)"
      isUploaded={getDocIsUploaded(applicant, "AL")}
    />
    <DocumentItem
      label="Bachelor’s Certificate"
      isUploaded={getDocIsUploaded(applicant, "BachelorsCertificate")}
    />
    <DocumentItem
      label="Bachelor’s Transcript"
      isUploaded={getDocIsUploaded(applicant, "BachelorsTranscript")}
    />
    <DocumentItem
      label="Master’s Certificate"
      isUploaded={getDocIsUploaded(applicant, "MastersCertificate")}
    />
    <DocumentItem
      label="Master’s Transcript"
      isUploaded={getDocIsUploaded(applicant, "MastersTranscript")}
    />
    <DocumentItem
      label="IELTS"
      isUploaded={getDocIsUploaded(applicant, "IELTS")}
    />
    <DocumentItem
      label="Passport"
      isUploaded={getDocIsUploaded(applicant, "Passport")}
    />
    <DocumentItem label="CV" isUploaded={getDocIsUploaded(applicant, "CV")} />
    <DocumentItem
      label="School Leaving Certificate"
      isUploaded={getDocIsUploaded(applicant, "SchoolLeavingCertificate")}
    />
    <DocumentItem
      label="Recommendation Letter"
      isUploaded={getDocIsUploaded(applicant, "RecommendationLetter")}
    />

    
  </div>
</section>;


// For additional file uploads
const [offerLetterFile, setOfferLetterFile] = useState(null);
const [visaEmbassyDocFile, setVisaEmbassyDocFile] = useState(null);
