<?php
// models/Transaction.php

require_once 'Model.php';

class Transaction extends Model {
    protected $table = 'transaction';
    protected $primaryKey = 'transaction_id';
}
?>
