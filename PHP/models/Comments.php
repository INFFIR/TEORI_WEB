<?php
// models/Comments.php

require_once 'Model.php';

class Comments extends Model {
    protected $table = 'comments';
    protected $primaryKey = 'comments_id';
}
?>
