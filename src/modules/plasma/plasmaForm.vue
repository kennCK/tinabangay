 <template>
    <div class="card">
        <div class="card-header plasma-header">
        </div>
        <div class="card-body plasma-body">
            <div class="card plasma-card-content">
                <div class="card-body">
                    <div class="form-group">
                        <!-- <label for="comment" id="content">Content:</label> -->
                        <textarea class="form-control" placeholder="Type your POST here... Please Include Your Address" rows="15" id="comment"></textarea>
                    </div>
                </div>
                <div class="card-footer plasma-footer text-right">
                    <button type="button" class="btn btn-primary post-btn plasma-post">POST</button>
                    <button type="button" class="btn btn-danger post-btn plasma-cancel">CANCEL</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
            }
        },
        methods: {
        }
    }
</script>

<style scoped>
    .plasma-header{
        height:170px;
        background-color:#005b96;
    }
    .plasma-footer{
        border-top:none;
        padding-bottom:30px;
        padding-top:0px;
    }
    .plasma-body{
        padding-left:80px;
        padding-right:80px;
        padding-bottom:30px;
    }
    .plasma-card-content{
        margin-top:-100px;
        border:none;
        /* border:1px solid #fa2525; */
    }
    .plasma-card-content-header{
        height:82px;
        /* border:1px solid#d63838; */
    }
    .plasma-form-header{
        color:#005b96;
        padding-top:8px;
        font-size:40px;
    }
    #content{
        font-size:15px;
        font-weight:bold;
        font-style:italic;
    }
    textarea{
        border:1px solid #1492ff;
    }
    .post-btn{
        width:130px;
        outline:none;
    }
    h1{
        color:white;
        text-align:center
    }

</style>
