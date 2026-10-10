<?php

return [
    'to' => env('RECRUITMENT_MAIL_TO'),
    'to_name' => env('RECRUITMENT_MAIL_NAME', 'Nu-Isoleren Sollicitaties'),
    'from' => env('RECRUITMENT_FROM_ADDRESS'),
    'from_name' => env('RECRUITMENT_FROM_NAME', 'Nu-Isoleren'),
    'max_cv_mb' => (int) env('RECRUITMENT_MAX_CV_MB', 5),
];
