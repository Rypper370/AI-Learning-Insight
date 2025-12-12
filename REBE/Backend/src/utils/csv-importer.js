const normalized_features = [
    parseFloat(row.1),
    parseFloat(row.2),
    parseFloat(row.3),
    parseFloat(row.4),
    parseFloat(row.5),
];

await supabase.from('user_learning_predictions').insert({
    user_id: row_user_id,
    normalized_features: normalized_features,
    cluster: row.cluster,
    learning_style: row.learning_style
})