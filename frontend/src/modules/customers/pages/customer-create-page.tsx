import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/common/components/ui/button';
import { Input } from '@/common/components/ui/input';
import { Textarea } from '@/common/components/ui/textarea';
import { FieldError, FieldHint, FieldLabel } from '@/common/components/forms/form-field';
import { FormShell } from '@/common/components/forms/form-shell';
import { FormDirtyBanner } from '@/common/components/forms/form-dirty-banner';
import { PayloadPreview } from '@/common/components/forms/payload-preview';
import { PageHeader } from '@/common/components/page/page-header';
import { useToast } from '@/common/components/feedback/toast-provider';
import { useConfirm } from '@/common/components/feedback/confirm-dialog-provider';
import { useUnsavedChanges } from '@/common/hooks/use-unsaved-changes';
import { appendLocalEntity } from '@/common/lib/local-entity-store';
import { useCreateCustomer } from '@/modules/customers/hooks/use-customers';
import type { Customer } from '@/common/types/domain';
import type { CreateCustomerPayload } from '@/modules/customers/types/customer.types';

const schema = z.object({
  nik: z.string().min(8, 'NIK minimal 8 karakter'),
  nama: z.string().min(3, 'Nama minimal 3 karakter'),
  no_hp: z.string().optional(),
  alamat: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function CustomerCreatePage() {
  const [lastPayload, setLastPayload] = useState<CreateCustomerPayload>();
  const [submitState, setSubmitState] = useState<string>();
  const navigate = useNavigate();
  const createCustomerMutation = useCreateCustomer();
  const { showToast } = useToast();
  const { confirm } = useConfirm();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting, isDirty } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { nik: '', nama: '', no_hp: '', alamat: '' },
  });

  useUnsavedChanges({ when: isDirty });

  const onSubmit = handleSubmit(async (values) => {
    const payload: CreateCustomerPayload = {
      nik: values.nik,
      nama: values.nama,
      no_hp: values.no_hp || null,
      alamat: values.alamat || null,
    };
    setLastPayload(payload);

    const localRecord: Customer = {
      ...payload,
      createdAt: new Date().toISOString(),
    };

    try {
      await createCustomerMutation.mutateAsync(payload);
      appendLocalEntity('customers', localRecord);
      showToast({ title: 'Pelanggan ditambahkan', description: 'Data pelanggan baru akan muncul pada daftar pelanggan.', tone: 'success' });
      navigate('/customers');
    } catch {
      appendLocalEntity('customers', localRecord);
      setSubmitState('Pelanggan disimpan ke mode lokal sambil menunggu backend aktif.');
      showToast({ title: 'Tersimpan di mode lokal', description: 'Data pelanggan ditambahkan ke daftar untuk validasi flow.', tone: 'info' });
      navigate('/customers');
    }
  });

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Pelanggan" title="Tambah Pelanggan" />
      <div className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
        <FormShell eyebrow="Form" title="Input Pelanggan Baru" subtitle="Pisahkan alur list dan input agar operasional lebih rapi.">
          <FormDirtyBanner visible={isDirty} />
          <form className="mt-4 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
            <div>
              <FieldLabel htmlFor="nik">NIK</FieldLabel>
              <Input id="nik" placeholder="3401123456780001" {...register('nik')} />
              <FieldError>{errors.nik?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="nama">Nama</FieldLabel>
              <Input id="nama" placeholder="Nama pelanggan" {...register('nama')} />
              <FieldError>{errors.nama?.message}</FieldError>
            </div>
            <div>
              <FieldLabel htmlFor="no_hp">No HP</FieldLabel>
              <Input id="no_hp" placeholder="08xxxxxxxxxx" {...register('no_hp')} />
              <FieldHint>Opsional.</FieldHint>
            </div>
            <div className="md:col-span-2">
              <FieldLabel htmlFor="alamat">Alamat</FieldLabel>
              <Textarea id="alamat" placeholder="Alamat pelanggan" {...register('alamat')} />
            </div>
            <div className="md:col-span-2 flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={isSubmitting || createCustomerMutation.isPending}>Simpan Pelanggan</Button>
              <Button type="button" variant="secondary" onClick={async () => {
                if (!isDirty) {
                  navigate('/customers');
                  return;
                }
                const approved = await confirm({ title: 'Batalkan input pelanggan?', description: 'Perubahan yang belum disimpan akan hilang.' });
                if (approved) navigate('/customers');
              }}>Batal</Button>
              <Button type="button" variant="secondary" onClick={async () => {
                if (!isDirty) return reset();
                const approved = await confirm({ title: 'Reset form pelanggan?', description: 'Perubahan yang belum disimpan akan hilang.' });
                if (approved) reset();
              }}>Reset</Button>
              {submitState ? <span className="text-sm theme-muted">{submitState}</span> : null}
            </div>
          </form>
        </FormShell>
        <PayloadPreview title="Payload Pelanggan" payload={lastPayload} />
      </div>
    </div>
  );
}
