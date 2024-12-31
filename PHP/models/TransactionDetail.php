<?php
// models/TransactionDetail.php

require_once 'Model.php';

class TransactionDetail extends Model {
    protected $table = 'transaction_detail';
    protected $primaryKey = 'detail_id';
}
?>
