const express = require('express');
const router = express.Router();
const path = require('path');
const archiver = require('archiver');
const fs = require('fs');

router.post('/download-resumes', async (req, res) => {
    try {
        const { applicants } = req.body;

        if (!applicants || applicants.length === 0) {
            return res.status(400).send('No applicants provided');
        }

        const zip = archiver('zip', { zlib: { level: 9 } });

        res.attachment('resumes.zip');

        zip.on('error', (err) => {
            console.error('Error creating ZIP:', err);
            res.status(500).send('Error creating ZIP file');
        });

        zip.pipe(res);

        applicants.forEach((applicant) => {
            const pdfFileName = applicant.pdf.replace(/^uploads[\\/]/, '');
            const filePath = path.join(__dirname, '..', 'uploads', pdfFileName);
            if (fs.existsSync(filePath)) {
                const fileName = `${applicant.fullName}_resume.pdf`;
                zip.file(filePath, { name: fileName });
            } else {
                console.error(`File not found: ${filePath}`);
            }
        });
        zip.finalize().catch((err) => {
            console.error('Error finalizing ZIP:', err);
            res.status(500).send('Error finalizing ZIP file');
        });
    } catch (err) {
        console.error('Error creating ZIP:', err);
        res.status(500).send('Error creating ZIP file');
    }
});

module.exports = router;
