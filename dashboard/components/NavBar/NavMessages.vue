<template>
  <!-- Messages Dropdown Start -->
                <!--================================-->
                <li class="list-inline-item dropdown hidden-xs">
                  <a
                    class="message-icon"
                    href
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i data-feather="message-square" class="wd-20"></i>
                    <span class="messages-count wave in"></span>
                  </a>
                  <div class="dropdown-menu dropdown-menu-right">
                    <div class="top-message-area">
                      <div class="top-message-heading">
                        <div class="heading-title">
                          <h6>Messages</h6>
                        </div>
                        <span>5+ New Messages</span>
                      </div>
                      <div class="message-box" id="messageBox">
                        <a class="dropdown-item list-group-item" href="javascript:void(0)">
                          <div class="d-flex justify-content-between">
                            <div class="pd-r-10">
                              <span class="avatar avatar-online">
                                <img src="~/assets/images/users-face/1.png" class="img-fluid" alt />
                                <i></i>
                              </span>
                            </div>
                            <div>
                              <span class="tx-semibold">Mary Adams</span>
                              <span class="small tx-gray-500 ft-right">Mar 20, 22:21pm</span>
                              <div
                                class="tx-gray-700"
                              >Congratulate! Socrates Itumayfor work anniversaries</div>
                            </div>
                          </div>
                        </a>
                        <a class="dropdown-item list-group-item" href="javascript:void(0)">
                          <div class="d-flex justify-content-between">
                            <div class="pd-r-10">
                              <span class="avatar avatar-online">
                                <img src="~/assets/images/users-face/2.png" class="img-fluid" alt />
                                <i></i>
                              </span>
                            </div>
                            <div>
                              <span class="tx-semibold">Richards Caleb</span>
                              <span class="small tx-gray-500 ft-right">Mar 2, 22:21pm</span>
                              <div class="tx-gray-700">Richards Caleb, just created a new blog post</div>
                            </div>
                          </div>
                        </a>
                        <a class="dropdown-item list-group-item" href="javascript:void(0)">
                          <div class="d-flex justify-content-between">
                            <div class="pd-r-10">
                              <span class="avatar avatar-busy">
                                <img src="~/assets/images/users-face/3.png" class="img-fluid" alt />
                                <i></i>
                              </span>
                            </div>
                            <div>
                              <span class="tx-semibold">Lane Richards</span>
                              <span class="small tx-gray-500 ft-right">Mar 12, 22:21pm</span>
                              <div class="tx-gray-700">Richards Caleb, just created a new blog post</div>
                            </div>
                          </div>
                        </a>
                        <a class="dropdown-item list-group-item" href="javascript:void(0)">
                          <div class="d-flex justify-content-between">
                            <div class="pd-r-10">
                              <span class="avatar avatar-busy">
                                <img src="~/assets/images/users-face/4.png" class="img-fluid" alt />
                                <i></i>
                              </span>
                            </div>
                            <div>
                              <span class="tx-semibold">Edward Lane</span>
                              <span class="small tx-gray-500 ft-right">Mar 15, 02:21pm</span>
                              <div
                                class="tx-gray-700"
                              >Adrian Monino, added new comment on your photo</div>
                            </div>
                          </div>
                        </a>
                        <a class="dropdown-item list-group-item" href="javascript:void(0)">
                          <div class="d-flex justify-content-between">
                            <div class="pd-r-10">
                              <span class="avatar avatar-offline">
                                <img src="~/assets/images/users-face/5.png" class="img-fluid" alt />
                                <i></i>
                              </span>
                            </div>
                            <div>
                              <span class="tx-semibold">Lane Richards</span>
                              <span class="small tx-gray-500 ft-right">Mar 20, 08:28pm</span>
                              <div class="tx-gray-700">Edward Lane, added new comment on your photo</div>
                            </div>
                          </div>
                        </a>
                        <a class="dropdown-item list-group-item" href="javascript:void(0)">
                          <div class="d-flex justify-content-between">
                            <div class="pd-r-10">
                              <span class="avatar avatar-offline">
                                <img src="~/assets/images/users-face/6.png" class="img-fluid" alt />
                                <i></i>
                              </span>
                            </div>
                            <div>
                              <span class="tx-semibold">Edward Lane</span>
                              <span class="small tx-gray-500 ft-right">Mar 21, 22:21pm</span>
                              <div class="tx-gray-700">Edward Lane, just created a new blog post</div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div class="top-message-footer">
                        <a href>View all Messages</a>
                      </div>
                    </div>
                  </div>
                </li>
                <!--/ Messages Dropdown End -->
</template>

<script>
export default {
    name: 'NavMessages'
}
</script>

<style>

</style>