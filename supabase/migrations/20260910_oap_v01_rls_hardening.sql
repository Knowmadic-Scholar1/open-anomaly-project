-- OAP V0.1 RLS hardening (mirror of remote migration oap_v01_rls_hardening)
-- Public browse of investigation graph; authenticated inserts; lock down PostGIS API exposure.

create policy observations_public_read on public.observations
  for select using (
    exists (
      select 1 from public.events e
      where e.id = observations.event_id and e.moderation_state = 'visible'
    )
  );

create policy evidence_public_read on public.evidence
  for select using (
    exists (
      select 1 from public.events e
      where e.id = evidence.event_id and e.moderation_state = 'visible'
    )
  );

create policy hypotheses_public_read on public.hypotheses
  for select using (
    exists (
      select 1 from public.events e
      where e.id = hypotheses.event_id and e.moderation_state = 'visible'
    )
  );

create policy investigations_public_read on public.investigations
  for select using (
    exists (
      select 1 from public.events e
      where e.id = investigations.event_id and e.moderation_state = 'visible'
    )
  );

create policy event_status_history_public_read on public.event_status_history
  for select using (
    exists (
      select 1 from public.events e
      where e.id = event_status_history.event_id and e.moderation_state = 'visible'
    )
  );

create policy user_profiles_owner_all on public.user_profiles
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy observations_auth_insert on public.observations
  for insert to authenticated with check (true);

create policy evidence_auth_insert on public.evidence
  for insert to authenticated with check (true);

create policy hypotheses_auth_insert on public.hypotheses
  for insert to authenticated with check (true);

create policy investigations_auth_insert on public.investigations
  for insert to authenticated with check (true);

revoke all on table public.spatial_ref_sys from anon, authenticated;
revoke execute on function public.st_estimatedextent(text, text) from anon, authenticated;
revoke execute on function public.st_estimatedextent(text, text, text) from anon, authenticated;
revoke execute on function public.st_estimatedextent(text, text, text, boolean) from anon, authenticated;
