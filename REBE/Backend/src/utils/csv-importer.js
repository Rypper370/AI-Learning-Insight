const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { supabaseAdmin } = require('../config/supabase');

async function importCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => results.push(row))
      .on('end', async () => {
        console.log(`CSV loaded: ${results.length} rows`);

        for (const row of results) {
          try {
            const normalized_features = [
              parseFloat(row.norm_total_submissions),
              parseFloat(row.norm_avg_submission_rating),
              parseFloat(row.norm_avg_exam_score),
              parseFloat(row.norm_total_journeys_completed),
              parseFloat(row.norm_avg_speed_ratio),
            ];

            const { error } = await supabaseAdmin
              .from('user_learning_predictions')
              .insert({
                user_id: row.user_id,
                total_submissions: row.total_submissions,
                avg_submission_rating: row.avg_submission_rating,
                avg_exam_score: row.avg_exam_score,
                total_journeys_completed: row.total_journeys_completed,
                avg_speed_ratio: row.avg_speed_ratio,
                cluster: row.cluster,
                learning_style: row.learning_style,
                normalized_features: normalized_features,
              });

            if (error) {
              console.error(
                `Error inserting row for user ${row.user_id}:`,
                error.message
              );
            }
          } catch (err) {
            console.error(`Row parsing error:`, err);
          }
        }

        console.log('CSV import complete!');
        resolve();
      })
      .on('error', reject);
  });
}

const csvPath = path.resolve(__dirname, '../models/dataset.csv');

(async () => {
  console.log('Loading CSV from:', csvPath);
  await importCSV(csvPath);
})();
