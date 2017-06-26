/**
 * 这里是书籍列表模块
 * @type {[type]}
 */
var bookListModule = angular.module("BookListModule", []);
bookListModule.controller('BookListCtrl', function($scope, $http, $state, $stateParams) {
    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [5, 10, 20],
        pageSize: 5,
        currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize) {
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.books = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };

    //这里可以根据路由上传递过来的bookType参数加载不同的数据
    console.log($stateParams);
    $scope.getPagedDataAsync = function(pageSize, page, searchText) {
        setTimeout(function() {
            var data;
            if (searchText) {
                var ft = searchText.toLowerCase();
                $http.get('./data/books' + $stateParams.bookType + '.json')
                    .success(function(largeLoad) {
                        data = largeLoad.filter(function(item) {
                            return JSON.stringify(item).toLowerCase().indexOf(ft) != -1;
                        });
                        $scope.setPagingData(data, page, pageSize);
                    });
            } else {
                $http.get('./data/books' + $stateParams.bookType + '.json')
                    .success(function(largeLoad) {
                        $scope.setPagingData(largeLoad, page, pageSize);
                    });
            }
        }, 100);
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function(newVal, oldVal) {
        if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function(newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.gridOptions = {
        data: 'books',
        rowTemplate: '<div style="height: 100%"><div ng-style="{ \'cursor\': row.cursor }" ng-repeat="col in renderedColumns" ng-class="col.colIndex()" class="ngCell ">' +
            '<div class="ngVerticalBar" ng-style="{height: rowHeight}" ng-class="{ ngVerticalBarVisible: !$last }"> </div>' +
            '<div ng-cell></div>' +
            '</div></div>',
        multiSelect: false,
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEdit: true,
        enablePinning: true,
        columnDefs: [{
            field: 'index',
            displayName: '序号',
            width: 60,
            pinnable: false,
            sortable: false
        }, {
            field: 'name',
            displayName: '书名',
            enableCellEdit: true
        }, {
            field: 'author',
            displayName: '作者',
            enableCellEdit: true,
            width: 220
        }, {
            field: 'pubTime',
            displayName: '出版日期',
            enableCellEdit: true,
            width: 120
        }, {
            field: 'price',
            displayName: '定价',
            enableCellEdit: true,
            width: 120,
            cellFilter: 'currency:"￥"'
        }, {
            field: 'bookId',
            displayName: '操作',
            enableCellEdit: false,
            sortable: false,
            pinnable: false,
            cellTemplate: '<div><a ui-sref="bookdetail({bookId:row.getProperty(col.field)})" id="{{row.getProperty(col.field)}}">详情</a></div>'
        }],
        enablePaging: true,
        showFooter: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions
    };
});


/**
 * 这里是书籍详情模块
 * @type {[type]}
 */
var bookDetailModule = angular.module("BookDetailModule", []);
bookDetailModule.controller('BookDetailCtrl', function($scope, $http, $state, $stateParams) {
    console.log($stateParams);
    //请模仿上面的代码，用$http到后台获取数据，把这里的例子实现完整
});

/**
 * 这里是登录模块
 * @type {[type]}
 */
var bookLoginModule=angular.module("BookLoginModule",[]);
bookLoginModule.controller("BookLoginCtrl",function($scope, $http, $state, $stateParams){
    $scope.warning={
        'tip':false,
        'infor':''
    }
    $scope.login=function(){
        if($scope.username && $scope.password){
            $http.get('./data/admin.json')
                .success(function(largeLoad) {
                    if(largeLoad[0].username==$scope.username && largeLoad[0].password==$scope.password){
                        // alert("登录成功！");
                        $state.go('booklist',{bookType:0});
                    }else{
                        $scope.warning.tip=true;
                        $scope.warning.infor="用户名或密码不正确！"
                    }
                });
        }else{
            $scope.warning.tip=true;
            $scope.warning.infor="用户名和密码不能为空！"
        }
    }
    $scope.hideTip=function(){
        $scope.warning.tip=false;
    }
})

/**
 * 这里是注册模块
 * @type {[type]}
 */
var bookRegisterModule=angular.module("BookRegisterModule",[]);
bookRegisterModule.controller("BookRegisterCtrl",function($scope, $http, $state, $stateParams){
    $scope.reg={
        'adminname':'',
        'code':'',
        'email':''
    }
    $scope.register=function(){
        if(!reg.adminname.test($scope.userinfor.adminname)){
            $scope.warning.adminname='请输入合法用户名';
            $scope.warning.tip1=true;
        };
        if(!reg.code.test($scope.userinfor.code)){
            $scope.warning.code='请按要求设置密码';
            $scope.warning.tip2=true;
        };
        if($scope.userinfor.code==$scope.userinfor.confirm){
            $scope.warning.confirm='密码输入不一致';
            $scope.warning.tip3=true;
        };
        if(!reg.email.test($scope.userinfor.email)){
            $scope.warning.email='请输入QQ邮箱';
            $scope.warning.tip4=true;
        };
    }
    $scope.hideTip1=function(){
        $scope.warning.tip1=false;
    }
    $scope.hideTip2=function(){
        $scope.warning.tip2=false;
    }
    $scope.hideTip3=function(){
        $scope.warning.tip3=false;
    }
    $scope.hideTip4=function(){
        $scope.warning.tip4=false;
    }
})





















