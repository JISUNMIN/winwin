package com.winwin.backend.post;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

import com.winwin.backend.user.UserAccount;
import com.winwin.backend.user.UserRepository;
import com.winwin.backend.user.UserRole;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

  @Mock private MatchingPostRepository matchingPostRepository;
  @Mock private UserRepository userRepository;

  private PostService postService;

  @BeforeEach
  void setUp() {
    postService = new PostService(matchingPostRepository, userRepository);
  }

  @Test
  void getDiscoverablePostsReturnsMappedResponses() {
    MatchingPost openPost = createPost(11L, PostStatus.OPEN);

    when(matchingPostRepository.findByStatusOrderByCreatedAtDesc(PostStatus.OPEN))
        .thenReturn(List.of(openPost));

    var responses = postService.getDiscoverablePosts();

    assertThat(responses).hasSize(1);
    assertThat(responses.get(0).id()).isEqualTo(11L);
    assertThat(responses.get(0).requirements()).containsExactly("리뷰 필수", "탈색 가능");
    assertThat(responses.get(0).availableDates()).containsExactly("2026-06-20", "2026-06-21");
    assertThat(responses.get(0).ownerName()).isEqualTo("파트너 테스트");
  }

  @Test
  void getDiscoverablePostRejectsClosedPost() {
    MatchingPost closedPost = createPost(22L, PostStatus.CLOSED);

    when(matchingPostRepository.findById(22L)).thenReturn(Optional.of(closedPost));

    assertThatThrownBy(() -> postService.getDiscoverablePost(22L))
        .isInstanceOf(ResponseStatusException.class)
        .hasMessageContaining("404 NOT_FOUND");
  }

  private MatchingPost createPost(Long id, PostStatus status) {
    MatchingPost post = new MatchingPost();
    ReflectionTestUtils.setField(post, "id", id);

    UserAccount owner = new UserAccount();
    ReflectionTestUtils.setField(owner, "id", 5L);
    owner.setName("파트너 테스트");
    owner.setRole(UserRole.PARTNER);
    owner.setEmail("partner@test.com");
    owner.setPasswordHash("hash");

    post.setOwner(owner);
    post.setCategory(PostCategory.HAIR);
    post.setShopName("테스트 살롱");
    post.setLocation("강남구");
    post.setLocationLatitude(37.5);
    post.setLocationLongitude(127.0);
    post.setLocationVisibility(PostLocationVisibility.SUMMARY_ONLY);
    post.setService("염색");
    post.setRequirements(List.of("리뷰 필수", "탈색 가능"));
    post.setAvailableDates(List.of(LocalDate.of(2026, 6, 20), LocalDate.of(2026, 6, 21)));
    post.setDeposit(5000);
    post.setDescription("테스트 설명");
    post.setStatus(status);
    return post;
  }
}
