// Database Schema Documentation:

// Table: processing_requests
// Columns:
//   request_id (VARCHAR, PRIMARY KEY)
//   status (VARCHAR) -- e.g., 'processing', 'completed'

// Table: images
// Columns:
//   id (SERIAL, PRIMARY KEY)
//   request_id (VARCHAR, FOREIGN KEY references processing_requests(request_id))
//   product_name (VARCHAR)
//   input_url (TEXT)
//   output_url (TEXT)  -- Will be filled once processing is complete
