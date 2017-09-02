SELECT
  g.*,
  l.*
FROM locations l
JOIN gigs g ON l.id = g.location_id;
